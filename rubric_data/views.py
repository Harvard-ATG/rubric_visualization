from django.http import JsonResponse
from django.conf import settings
from canvas_oauth.oauth import get_oauth_token
from canvas_sdk.exceptions import CanvasAPIError
from canvas_sdk.methods import submissions, assignments, courses, sections
from canvas_sdk.utils import get_all_list_data
from canvas_sdk import RequestContext
from rubric_visualization.decorators import api_login_required, api_canvas_oauth_token_exception

from .domain_model import (
    Student,
    Section,
    RubricAssignment,
    Criterion,
    Rating,
    Datapoint
)

import logging

logger = logging.getLogger(__name__)


@api_canvas_oauth_token_exception
@api_login_required
def course_data(request, course_id):
    
    access_token = get_oauth_token(request)
    request_context = RequestContext(**settings.CANVAS_SDK_SETTINGS, auth_token=access_token)

    try:
        assignments = get_assignments_list(request_context, course_id)
        assignment_ids = [assignment['id'] for assignment in assignments]
        submissions = get_submissions_with_rubric_assessments(
            request_context,
            course_id,
            assignment_ids
            )
        sections_list = get_sections_list(request_context, course_id)
    except CanvasAPIError as e:
        msg = f"Canvas API error {e.status_code}"
        logger.exception(msg)
        return JsonResponse({"message": msg}, status=500)

    students_dict, sections_dict = students_sections_tuple(sections_list)
    rubric_assignments = rubric_assignments_dict(assignments)

    criteria_lookup = { criterion["id"]: criterion
        for assignment in rubric_assignments
        for criterion in rubric_assignments[assignment]["rubric"]
    }
    
    datapoints = datapoints_list(criteria_lookup, students_dict, submissions)
    payload = {
        "students": students_dict,
        "sections": sections_dict,
        "rubric_assignments": rubric_assignments,
        "denormalized_data": datapoints
    }

    return JsonResponse(payload)


def students_sections_tuple(sections_list):
    """Iterate over a list of sections and return  a tuple of dictionaries 
    of Student(s) and Section(s) respectively
    """
    students = {}
    sections = {}

    for section in sections_list:
        for student in section["students"]:
            if student["id"] not in students:
                students[student["id"]] = Student(
                    id=student["id"],
                    name=student["sortable_name"],
                    sections=[section["id"]]
                )._asdict()
            else:
                students[student["id"]]["sections"].append(section["id"])

        if section["id"] not in sections:
            sections[section["id"]] = Section(
                id=section["id"],
                full_name=section["name"],
                short_name=section["name"].rpartition(" ")[2]
            )._asdict()

    return students, sections

def rubric_assignments_dict(assignments_list):
    """Iterate over a list of assignments and return a dict of RubricAssignment(s) 
    keyed by their assignment_ids.
    'rubric' is a list of Criterion(s).
    'ratings' is a list of Rating(s)
    """
    rubric_assignments = {}

    for assignment in assignments_list:
        if assignment["id"] not in rubric_assignments:
            rubric_assignments[assignment["id"]] = RubricAssignment(
                id=assignment["id"],
                name=assignment["name"],
                due_at=assignment["due_at"],
                rubric=[ Criterion(
                    id=f"{assignment['id']}{criterion['id']}",
                    description=criterion["description"],
                    ratings=[ Rating(
                        id=rating["id"],
                        points=rating["points"],
                        description=rating["description"]
                    )._asdict()
                    for rating in criterion["ratings"] ]
                )._asdict()
                for criterion in assignment["rubric"] ]
            )._asdict()

    return rubric_assignments


def datapoints_list(criteria_dict, students_dict, submissions):
    """Iterates over a list of submissions and returns a list of Datapoint(s)."""
    output = []
    for assignment in submissions:
        for submission in assignment["submissions"]:
            for criterion_id, criterion_data in submission["rubric_assessment"].items():
                if 'points' in criterion_data:
                    score = criterion_data["points"]
                    unique_criterion_id = f"{assignment['assignment_id']}{criterion_id}"
                    rating = get_rating_info(unique_criterion_id, score, criteria_dict)
                    if rating is not None:
                        for section in students_dict[submission["user_id"]]["sections"]:
                            output.append(
                                Datapoint(
                                    student_id=submission["user_id"],
                                    assignment_id=assignment["assignment_id"],
                                    criterion_id=unique_criterion_id,
                                    section_id=section,
                                    score=score,
                                    rating=rating
                                )._asdict()
                            )                           
    return output


def get_rating_info(criterion_id, score, criteria_lookup):
    """
    Returns the rating description that matches the points assessed for the criterion.
    """
    criterion_info = criteria_lookup[criterion_id]
    criterion_info['ratings'].sort(reverse=False, key=lambda x: x['points'])
    for rating in criterion_info['ratings']:
        if score <= rating['points']:
            return rating['description']
    return None

def get_sections_list(request_context, course_id):
    """
    Returns a list of sections for the course.
    https://canvas.instructure.com/doc/api/sections.html#method.sections_api.index
    """
    results = get_all_list_data(
        request_context,
        sections.list_course_sections,
        course_id,
        "students"
    )
    returned_sections = filter(lambda x: x['students'] is not None, results)
    return list(returned_sections)
   
    
def get_assignments_list(request_context, course_id):
    """
    Returns a list of assignments for the course.
    https://canvas.instructure.com/doc/api/assignments.html#method.assignments_api.index 
    """
    
    keys = ("id", "name", "due_at", "rubric")
    results = get_all_list_data(
        request_context,
        assignments.list_assignments,
        course_id,
        ""
        )
    # returned_assignments = list(filter(lambda x: "rubric" in x, results))
    # return [{k: assignment[k] for k in keys} for assignment in returned_assignments]
    return list(filter(lambda x: "rubric" in x, results))
    

def get_submissions_with_rubric_assessments(request_context, course_id, assignment_ids):
    """
    Returns the submission and rubric assessment data for each assignment.
    https://canvas.instructure.com/doc/api/submissions.html#method.submissions_api.index
    """
    include = "rubric_assessment"
    results = []
    for assignment_id in assignment_ids:
        list_data = get_all_list_data(
            request_context,
            submissions.list_assignment_submissions_courses,
            course_id,
            assignment_id,
            include
            )
        filtered_submissions = list(filter(valid_submissions, list_data))
        results.append({
            "assignment_id": assignment_id,
            "submissions": filtered_submissions,
        })
    return results


def valid_submissions(submission):
    """Returns boolean check on a submission object"""
    return ('rubric_assessment' in submission
        and submission['workflow_state'] == 'graded'
        and submission['score'] is not None)
