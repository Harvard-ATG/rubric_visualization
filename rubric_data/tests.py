from django.conf import settings
from django.test import TestCase
from .views import datapoints_list, get_rating_info

import json
import random
import string

with open(settings.PROJECT_ROOT + '/rubric_data/test_data/test_data.json') as json_file:
    TEST_DATA = json.load(json_file)

RUBRIC_ASSIGNMENTS = TEST_DATA["rubric_assignments"]
SECTIONS = TEST_DATA["sections"]
STUDENTS = TEST_DATA["students"]
DENORMALIZED_DATA = TEST_DATA["denormalized_data"]

class ViewTests(TestCase):

    def test_get_rating(self):
        criteria_dict = {
            "_396" : {
                "ratings": [
                    {
                        "description": "Full Marks",
                        "points": 8
                    },
                    {
                        "description": "Partial Marks",
                        "points": 4
                    },
                    {
                        "description": "No Marks",
                        "points": 0
                    }
                ] 
            },
            "_5661" : {
                "ratings": [
                    {
                        "description": "No Marks",
                        "points": 0
                    },
                    {
                        "description": "Full Marks",
                        "points": 8
                    },
                    {
                        "description": "Partial Marks",
                        "points": 4
                    }, 
                ] 
            }
        }

        rating1 = get_rating_info('_396', 6, criteria_dict)
        rating2 = get_rating_info('_5661', 0, criteria_dict)
        self.assertEqual(rating1, "Full Marks")
        self.assertEqual(rating2, "No Marks")
        

def generate_test_data(example_json):
    student_scrub_map = {}
    
    students, sections, rubric_assignments, denormalied_data = example_json
    students_dict = example_json[students]
    denormalied_data_list = example_json[denormalied_data]

    for k, v in students_dict.items():
        student_scrub_map[k] = {
            "old_id": v["id"],
            "new_id": random.randint(10000, 90000),
            "new_name": random_sortable_name()
        }
   
    scrubbed_students = { student_scrub_map[k]["new_id"] : {
            "id": student_scrub_map[k]["new_id"],
            "name": student_scrub_map[k]["new_name"],
            "sections": v["sections"]
            }
        for k, v in students_dict.items()
        }
    
    scrubbed_denormalized_data = [ 
        {
            "student_id": student_scrub_map[str(datapoint["student_id"])]["new_id"],
            "assignment_id": datapoint["assignment_id"],
            "criterion_id": datapoint["criterion_id"],
            "section_id": datapoint["section_id"],
            "score": datapoint["score"],
            "rating": datapoint["rating"]
        }
        for datapoint in denormalied_data_list
        ]

    data = {
        "students": scrubbed_students,
        "sections": example_json[sections],
        "rubric_assignments": example_json[rubric_assignments],
        "denormalized_data": scrubbed_denormalized_data 
    }
    
    with open("test_data.json", 'w') as outfile:
        json.dump(data, outfile, indent=2)

    return data


def random_string():
    """
    Docstring
    """
    letters = string.ascii_lowercase
    return ( ''.join(random.choice(letters) for i in range(7)) )


def random_sortable_name():
    """
    Docstring
    """
    return f"{random_string()}, {random_string()}"

