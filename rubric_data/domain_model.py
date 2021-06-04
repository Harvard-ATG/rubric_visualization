from collections import namedtuple

from .exceptions import StudentsSectionsError, RubricAssignmentsError, DatapointsError

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


def students_sections_tuple(sections_list):
    """Iterate over a list of sections and return  a tuple of dictionaries 
    of Student(s) and Section(s) respectively
    """
    if len(sections_list) == 0:
        raise StudentsSectionsError(message="sections list is empty.")
    
    students = {}
    sections = {}
    
    try:
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
    except KeyError:
        raise StudentsSectionsError(message="sections data not in the expected form.")
    
    return students, sections


def rubric_assignments_dict(assignments_list):
    """Iterate over a list of assignments and return a dict of RubricAssignment(s) 
    keyed by their assignment_ids.
    'rubric' is a list of Criterion(s).
    'ratings' is a list of Rating(s)
    """
    if len(assignments_list) == 0:
        raise RubricAssignmentsError(message="assignments list is empty.")


    rubric_assignments = {}

    # Note, criterion ids are not unique coming from canvas.
    # In order to make them unique, I concatenate them with the assignment id.
    try:
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
    except KeyError:
        raise RubricAssignmentsError(message="assignments data not in the expected form.")

    return rubric_assignments


def datapoints_list(criteria_dict, students_dict, submissions):
    """Iterates over a list of submissions and returns a list of Datapoint(s)."""
    if len(submissions) == 0:
        raise DatapointsError(message="submissions list is empty.")
    
    output = []
   
    try:
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
    except KeyError:
        raise DatapointsError(message="submissions data not in the expected form.")

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