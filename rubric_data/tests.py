from django.test import TestCase, override_settings

from django.core.cache import cache
from .views import create_cache
from .domain_model import (
    datapoints_list,
    get_rating_info,
    rubric_assignments_dict,
    students_sections_tuple,
    )
from .test_data.mock_data import (
    MOCK_SECTIONS_LIST,
    MOCK_CRITERIA_DICT,
    MOCK_ASSIGNMENTS_LIST,
    MOCK_SUBMISSONS_LIST
    )

import json
import random
import string
import uuid


class ViewTests(TestCase):

    def test_get_rating(self):
        rating1 = get_rating_info('2334_396', 6, MOCK_CRITERIA_DICT)
        rating2 = get_rating_info('2334_5661', 0, MOCK_CRITERIA_DICT)
        self.assertEqual(rating1, "Full Marks")
        self.assertEqual(rating2, "No Marks")

    def test_students_sections_tuple(self):
        students, sections = students_sections_tuple(MOCK_SECTIONS_LIST)
        self.assertEqual(students[123]["sections"], [0,1])
        self.assertEqual(students[789]["sections"], [1])
        self.assertEqual(sections[0]["full_name"], "Section 001")
        self.assertEqual(sections[0]["short_name"], "001")

    def test_rubric_assignments_dict(self):
        rubric_assignments = rubric_assignments_dict(MOCK_ASSIGNMENTS_LIST)
        self.assertEqual(rubric_assignments[123]["name"], "First Assignment")
        self.assertEqual(len(rubric_assignments[123]["rubric"]), 2)
        self.assertTrue(rubric_assignments[123]["rubric"][0]["id"].startswith("123_"))

    def test_datapoints_list(self):
        rubric_assignments = rubric_assignments_dict(MOCK_ASSIGNMENTS_LIST)
        students = students_sections_tuple(MOCK_SECTIONS_LIST)[0]
        criteria_lookup = { criterion["id"]: criterion
            for assignment in rubric_assignments
            for criterion in rubric_assignments[assignment]["rubric"]
        }
        denormalized_data = datapoints_list(criteria_lookup, students, MOCK_SUBMISSONS_LIST)
        self.assertEqual(len(denormalized_data), 12)
        self.assertEqual(denormalized_data[0]["score"], 6.5)
        self.assertEqual(denormalized_data[0]["rating"], "Good enough")
        self.assertEqual(denormalized_data[6]["score"], 2)
        self.assertEqual(denormalized_data[6]["rating"], "Not Good enough")

    # https://docs.djangoproject.com/en/3.2/topics/cache/#local-memory-caching
    # https://docs.djangoproject.com/en/3.2/topics/testing/tools/#django.test.override_settings
    # override_settings is used to override the cache to use local memory instead of redis for testing
    @override_settings(CACHES = {'default': {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'}})
    def test_create_cache(self):
        user_id = uuid.uuid4().hex
        course_id = random.randint(10000, 99999)
        cache_user_id_course_id  = f"{user_id}{course_id}"
        test_payload = {'rating_id': f'_{random.randint(1000, 9999)}', 'comments': '', 'points': 6.0}

        create_cache(cache_user_id_course_id, test_payload)
        result = cache.get(cache_user_id_course_id)
        self.assertEqual(result, test_payload)
        

# TODO this should be a management command
def generate_test_data(example_json):
    """Returns payload data scrubbed of sensitive information"""
    
    student_scrub_map = {}
    
    students, sections, rubric_assignments, denormalied_data = example_json
    students_dict = example_json[students]
    denormalied_data_list = example_json[denormalied_data]

    random_int_sample = random.sample(range(10000, 90000), k=len(students_dict))

    for idx, (k, v) in enumerate(students_dict.items()):
        student_scrub_map[k] = {
            "old_id": v["id"],
            "new_id": random_int_sample[idx],
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

