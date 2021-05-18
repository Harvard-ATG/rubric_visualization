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
import json

logger = logging.getLogger(__name__)


@api_canvas_oauth_token_exception
@api_login_required
def course_data(request, course_id):
    
    access_token = get_oauth_token(request)
    request_context = RequestContext(**settings.CANVAS_SDK_SETTINGS, auth_token=access_token)

    # I don't need the students endpoint I believe

    try:
        students = get_students_list(request_context, course_id)
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

    payload = {
        'assignments': assignments,
        'submissions': submissions,
        'students': students,
        'sections': sections_list
    }
    payload['denormalized_data'] = denormalize(payload)


    students_dict, sections_dict = students_sections_tuple(sections_list)
    rubric_assignments = rubric_assignments_dict(assignments)

    criteria_lookup = { criterion["id"]: criterion
        for assignment in rubric_assignments
        for criterion in rubric_assignments[assignment]["rubric"]
    }
    
    datapoints = datapoints_list(criteria_lookup, students_dict, submissions)
    second_paylod = {
        "students": students_dict,
        "sections": sections_dict,
        "rubric_assignments": rubric_assignments,
        "datapoints": datapoints
    }
    with open('outfile.json', 'w') as outfile:
        json.dump(second_paylod, outfile, indent=2)

    return JsonResponse(second_paylod)


def students_sections_tuple(sections_list):
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
    return_data = []
    for assignment in submissions:
        for submission in assignment["submissions"]:
            for criterion_id, criterion_data in submission["rubric_assessment"].items():
                if 'points' in criterion_data:
                    score = criterion_data["points"]
                    unique_criterion_id = f"{assignment['assignment_id']}{criterion_id}"
                    rating_tuple = get_rating_info(unique_criterion_id, score, criteria_dict)
                    if rating_tuple is not None:
                        for section in students_dict[submission["user_id"]]["sections"]:
                            return_data.append(
                                Datapoint(
                                    student_id=submission["user_id"],
                                    assignment_id=assignment["assignment_id"],
                                    criterion_id=unique_criterion_id,
                                    section_id=section,
                                    score=score,
                                    rating=rating_tuple[0]
                                )._asdict()
                            )
                                
    return return_data
    
def denormalize(data):
    """Denormalize the data provided by get_students_list, get_assignments_list, 
    and get_submissions_with_rubric_assessments, and return a list.

    argument: data
    data = {
        'assignments':get_assignments_list(),
        'submissions': get_submissions_with_rubric_assessments(),
        'students': get_student_list(),
        'sections': get_sections_list()
    } 
    """   
    if not data:
        return []
    
    assignments_lookup = { assignment['id'] : assignment for assignment in data['assignments']}
    # criterion IDs are NOT unique. Cat them with assignment IDs to create a unique key
    criteria_lookup = { f"{assignment['id']}{criterion['id']}" : criterion
        for assignment in data['assignments'] 
        for criterion in assignment['rubric'] 
    }
    students_lookup = { student['id'] : student for student in data['students']}
    sections_lookup = {}
    for section in data['sections']:
        # split out the relevant part of the name with rpartition
        _, _, section_name = section["name"].rpartition(" ")
        section_tuple = (section['sis_section_id'], section_name)
        for student in section['students']:
            if student['id'] not in sections_lookup:
                sections_lookup[student['id']] = [section_tuple]
            else:
                sections_lookup[student['id']].append(section_tuple)
        
    output = []

    # iterate through assignments
    for assignment in data['submissions']:
        assignment_id = assignment['assignment_id']
        assignment_name = assignments_lookup[assignment_id]['name']
    
        # iterate through submissions under assignments
        for submission in assignment['submissions']:
            
            submission_id = submission['id']
            student_id = submission['user_id']
            student_name = students_lookup[student_id]['sortable_name']
            section_tuples = sections_lookup[student_id]

            # iterate through criteria and ratings under submissions
            for criterion_id, criterion_data in submission['rubric_assessment'].items():
                if 'points' in criterion_data and criterion_data['rating_id'] is not None:
                    score = criterion_data['points']
                    unique_criterion_id = f"{assignment_id}{criterion_id}"
                    criterion_name = criteria_lookup[unique_criterion_id]['description']
                    rating_tuple = get_rating_info(unique_criterion_id, score, criteria_lookup)
                    if rating_tuple is not None:
                        for section_tuple in section_tuples:
                            row = {
                                "student_id": student_id,
                                "student_name": student_name,
                                "assignment_id": assignment_id,
                                "assignment_name": assignment_name,
                                "criterion_id": unique_criterion_id,
                                "criterion_name": criterion_name,
                                "section_id": section_tuple[0],
                                "section_name": section_tuple[1],
                                "score": score,
                                "rating": rating_tuple[0],
                                "rating_max_points": rating_tuple[1]
                            }
                            output.append(row)
    return output


def get_rating_info(criterion_id, score, criteria_lookup):
    """
    Add docstring
    Returns tuple of rating description, and rating "max points"
    """
    criterion_info = criteria_lookup[criterion_id]
    criterion_info['ratings'].sort(reverse=False, key=lambda x: x['points'])
    for rating in criterion_info['ratings']:
        if score <= rating['points']:
            return (rating['description'], rating['points'])
    return None

def get_sections_list(request_context, course_id):
    results = get_all_list_data(
        request_context,
        sections.list_course_sections,
        course_id,
        'students'
    )
    returned_sections = filter(lambda x: x['students'] is not None, results)
    return list(returned_sections)

def get_students_list(request_context, course_id):
    '''
    Returns a list of all students in the course.
    
    https://canvas.instructure.com/doc/api/courses.html#method.courses.users
    '''
    results = get_all_list_data(
        request_context,
        courses.list_users_in_course_users,
        course_id,
        "email",
        enrollment_type="student"
        )
    students = sorted([{"sortable_name":x['sortable_name'], "id": x['id']} for x in results], key=lambda x: x['sortable_name'])
    with open('students.json', 'w') as outfile:
        json.dump({'results': list(students)}, outfile)
    return list(students)
    
    
def get_assignments_list(request_context, course_id):
    '''
    Returns a list of assignments for the course.
    https://canvas.instructure.com/doc/api/assignments.html#method.assignments_api.index 
    '''
    
    keys = ('id', 'name', 'due_at', 'rubric', 'rubric_settings') # reduce the clutter
    results = get_all_list_data(
        request_context,
        assignments.list_assignments,
        course_id,
        ''
        )
    returned_assignments = list(filter(lambda x: 'rubric' in x, results))
    return [{k: assignment[k] for k in keys} for assignment in returned_assignments]
    

def get_submissions_with_rubric_assessments(request_context, course_id, assignment_ids):
    '''
    Returns the submission and rubric assessment data for each assignment.
    https://canvas.instructure.com/doc/api/submissions.html#method.submissions_api.index
    '''
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
    #  if 'rubric_assessment' in submission and submission['workflow_state'] == 'graded' and submission['score'] is not None:
    return results


def valid_submissions(submission):
    return ('rubric_assessment' in submission
        and submission['workflow_state'] == 'graded'
        and submission['score'] is not None)
