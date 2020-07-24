from django.http import JsonResponse
from django.conf import settings
from canvas_oauth.oauth import get_oauth_token
from canvas_sdk.exceptions import CanvasAPIError
from canvas_sdk.methods import submissions, assignments, courses
from canvas_sdk.utils import get_all_list_data
from canvas_sdk import RequestContext
from rubric_visualization.decorators import api_login_required, api_canvas_oauth_token_exception

import logging

logger = logging.getLogger(__name__)


@api_canvas_oauth_token_exception
@api_login_required
def course_data(request, course_id):
    
    access_token = get_oauth_token(request)
    request_context = RequestContext(**settings.CANVAS_SDK_SETTINGS, auth_token=access_token)

    try:
        students = get_students_list(request_context, course_id)
        assignments = get_assignments_list(request_context, course_id)
        assignment_ids = [assignment['id'] for assignment in assignments]
        submissions = get_submissions_with_rubric_assessments(
            request_context,
            course_id,
            assignment_ids
            )
    except CanvasAPIError as e:
        logger.exception("Canvas API error")
        msg = "Canvas API error {status_code}".format(status_code=e.status_code)
        return JsonResponse({"message": msg}, status=500)

    payload = {
        'assignments': assignments,
        'submissions': submissions,
        'students': students,
    }
    denormalized_data = denormalize(payload)
    payload['denormalized_data'] = denormalized_data
    
    return JsonResponse(payload)
    
    
def denormalize(data):
    """Denormalize the data provided by get_students_list, get_assignments_list, 
    and get_submissions_with_rubric_assessments, and return a list.

    argument: data
    data = {
        'assignments':get_assignments_list(),
        'submissions': get_submissions_with_rubric_assessments(),
        'students': get_student_list()
    } 
    """   
    if not data:
        return []
    
    assignments_lookup = {}
    criteria_lookup = {}
    students_lookup = {}
   
    for assignment in data['assignments']:
        assignments_lookup[assignment['id']] = assignment
        for criterion in assignment['rubric']:
            if criterion['id'] not in criteria_lookup:
                criteria_lookup[criterion['id']] = criterion

    for student in data['students']:
        students_lookup[student['id']] = student
        
    output = []

    # iterate through assignments
    for assignment in data['submissions']:
        assignment_id = assignment['assignment_id']
        assignment_name = assignments_lookup[assignment_id]['name']
    
        # iterate through submissions under assignments
        for submission in assignment['submissions']:
            if submission['workflow_state'] == 'graded':
                submission_id = submission['id']
                student_id = submission['user_id']
                student_name = students_lookup[student_id]['sortable_name']

                # iterate through criteria and ratings under submissions
                for criterion_id, criterion_data in submission['rubric_assessment'].items():
                    score = criterion_data['points']
                    criterion_name = criteria_lookup[criterion_id]['description']
                    row = {
                        "student_id": student_id,
                        "student_name": student_name,
                        "assignment_id": assignment_id,
                        "assignment_name": assignment_name,
                        "criterion_id": criterion_id,
                        "criterion_name": criterion_name,
                        "score": score,
                        "rating": get_rating(criterion_id, score, criteria_lookup)
                    }
                    output.append(row)
    return output


def get_rating(criterion_id, score, criteria_lookup):
    criterion_info = criteria_lookup[criterion_id]
    criterion_info['ratings'].sort(reverse=False, key=lambda x: x['points'])
    for rating in criterion_info['ratings']:
        if score <= rating['points']:
            return rating['description']
    return None


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
    my_assignments = list(filter(lambda x: 'rubric' in x, results))
    return [{k: assignment[k] for k in keys} for assignment in my_assignments]
    

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
        results.append({
            "assignment_id": assignment_id,
            "submissions": list_data,
        })
    return results
