from django.http import JsonResponse
from django.conf import settings
from canvas_oauth.oauth import get_oauth_token
from canvas_sdk.exceptions import CanvasAPIError
from canvas_sdk.methods import submissions, assignments, courses, sections
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
    
    return JsonResponse(payload)

    
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
            if student['id'] not in sections_lookup.keys():
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
            if 'rubric_assessment' in submission.keys() and submission['workflow_state'] == 'graded' and submission['score'] is not None:
                submission_id = submission['id']
                student_id = submission['user_id']
                student_name = students_lookup[student_id]['sortable_name']
                section_tuples = sections_lookup[student_id]

                # iterate through criteria and ratings under submissions
                for criterion_id, criterion_data in submission['rubric_assessment'].items():
                    if 'points' in criterion_data.keys() and criterion_data['rating_id'] is not None:
                        score = criterion_data['points']
                        unique_criterion_id = f"{assignment_id}{criterion_id}"
                        criterion_name = criteria_lookup[unique_criterion_id]['description']
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
                                "rating": get_rating(unique_criterion_id, score, criteria_lookup)
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

def get_sections_list(request_context, course_id):
    results = get_all_list_data(
        request_context,
        sections.list_course_sections,
        course_id,
        'students'
    )
    sections = filter(lambda x: x['students'] is not None, results)
    return list(sections)

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
    assignments = list(filter(lambda x: 'rubric' in x, results))
    return [{k: assignment[k] for k in keys} for assignment in assignments]
    

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
