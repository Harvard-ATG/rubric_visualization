from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings

from canvas_sdk.methods import submissions, assignments, courses
from canvas_sdk.utils import get_all_list_data
from canvas_sdk import RequestContext


def get_some_data(request):
    request_context = RequestContext(
        settings.SDK_OAUTH_TOKEN,
        settings.CANVAS_URL,
        per_page=100
        )
        
    course = 58055
    
    students = get_students_list(request_context, course)
    assignments = get_assignments_list(request_context, course)
    assignment_ids = [assignment['id'] for assignment in assignments]
    submissions = get_submissions_with_rubric_assessments(
        request_context,
        course,
        assignment_ids
        )
    data = {
        'assignments': assignments,
        'submissions': submissions,
        'students': students,
    }
    
    return JsonResponse(data)


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
    results = get_all_list_data(
        request_context,
        assignments.list_assignments,
        course_id,
        ''
        )
    return list(filter(lambda x: 'rubric' in x, results))
    

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
