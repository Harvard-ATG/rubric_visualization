from collections import namedtuple

STUDENT_FIELDS = 'id, name, sections'
SECTION_FIELDS = 'id, full_name, short_name'
RUBRIC_ASSIGNMENT_FIELDS = 'id, name, due_at, rubric'
CRITERION_FIELDS = 'id, description, ratings'
RATING_FIELDS = 'id, points, description'
DATAPOINT_FIELDS = 'student_id, assignment_id, criterion_id, section_id, score, rating'

Student = namedtuple('Student', STUDENT_FIELDS)
Section = namedtuple('Section', SECTION_FIELDS)
RubricAssignment = namedtuple('RubricAssignment', RUBRIC_ASSIGNMENT_FIELDS)
Criterion = namedtuple('Criterion', CRITERION_FIELDS)
Rating = namedtuple('Rating', RATING_FIELDS)
Datapoint = namedtuple('Datapoint', DATAPOINT_FIELDS)

