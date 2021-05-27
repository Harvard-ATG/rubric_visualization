from django.http import JsonResponse
from django.conf import settings
from canvas_oauth.oauth import get_oauth_token
from canvas_sdk.exceptions import CanvasAPIError
from canvas_sdk.methods import submissions, assignments, sections
from canvas_sdk.utils import get_all_list_data
from canvas_sdk import RequestContext
from rubric_visualization.decorators import (
    api_login_required,
    api_canvas_oauth_token_exception
    )

from .domain_model import (
    datapoints_list,
    rubric_assignments_dict,
    students_sections_tuple,
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
    
    results = get_all_list_data(
        request_context,
        assignments.list_assignments,
        course_id,
        ""
        )
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
