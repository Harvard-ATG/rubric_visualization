from django.conf import settings
from django.test import TestCase, override_settings
from django.core.cache import cache
from .views import denormalize, get_rating_info, create_cache

import json
import uuid
import random


class ViewTests(TestCase):
        
    def test_denormalize(self):
        with open(settings.PROJECT_ROOT + '/rubric_data/test_data/data.json') as json_file:
            data = json.loads(json_file.read())
            denormalized_data = denormalize(data)
            self.assertIs(type(denormalized_data), list)
            self.assertEqual(len(denormalized_data), 1612)
            self.assertEqual(len(denormalized_data[0]), 11)
            
    def test_denormalize_none(self):
        denormalized_data = denormalize(None)
        self.assertEqual(denormalized_data, [])

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
        self.assertEqual(rating1, ("Full Marks", 8))
        self.assertEqual(rating2, ("No Marks", 0))
    
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