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
from .exceptions import StudentsSectionsError, RubricAssignmentsError, DatapointsError


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

    def test_students_sections_tuple_raises_error(self):
        with self.assertRaises(StudentsSectionsError) as context:
            students_sections_tuple([])
        self.assertEqual("sections list is empty.", context.exception.message)

    def test_rubric_assignments_dict(self):
        rubric_assignments = rubric_assignments_dict(MOCK_ASSIGNMENTS_LIST)
        self.assertEqual(rubric_assignments[123]["name"], "First Assignment")
        self.assertEqual(len(rubric_assignments[123]["rubric"]), 2)
        self.assertTrue(rubric_assignments[123]["rubric"][0]["id"].startswith("123_"))

    def test_rubric_assignments_dict_raises_error(self):
        with self.assertRaises(RubricAssignmentsError) as context:
            rubric_assignments_dict([])
        self.assertEqual("assignments list is empty.", context.exception.message)

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

    def test_datapoints_list_raises_error(self):
        rubric_assignments = rubric_assignments_dict(MOCK_ASSIGNMENTS_LIST)
        students = students_sections_tuple(MOCK_SECTIONS_LIST)[0]
        criteria_lookup = { criterion["id"]: criterion
            for assignment in rubric_assignments
            for criterion in rubric_assignments[assignment]["rubric"]
        }
        
        with self.assertRaises(DatapointsError) as context:
            datapoints_list(criteria_lookup, students, [])
        self.assertEqual("submissions list is empty.", context.exception.message)

    # https://docs.djangoproject.com/en/3.2/topics/cache/#local-memory-caching
    # https://docs.djangoproject.com/en/3.2/topics/testing/tools/#django.test.override_settings
    # override_settings is used to override the cache to use local memory instead of redis for testing
    @override_settings(CACHES = {'default': {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'}})
    def test_create_cache(self):
        user_id = 'ad12732ghs'
        course_id = 1112354
        cache_user_id_course_id  = f"{user_id}{course_id}"
        test_payload = {'rating_id': '_091', 'comments': '', 'points': 6.0}

        create_cache(cache_user_id_course_id, test_payload)
        result = cache.get(cache_user_id_course_id)
        self.assertEqual(result, test_payload)

