from django.conf import settings
from django.test import TestCase
from .views import denormalize, get_rating

import json


class ViewTests(TestCase):
        
    def test_denormalize(self):
        with open(settings.PROJECT_ROOT + '/rubric_data/test_data/data.json') as json_file:
            data = json.loads(json_file.read())
            denormalized_data = denormalize(data)
            self.assertIs(type(denormalized_data), list)
            self.assertEqual(len(denormalized_data), 45)
            self.assertEqual(len(denormalized_data[0]), 10)
            
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

        rating1 = get_rating('_396', 6, criteria_dict)
        rating2 = get_rating('_5661', 0, criteria_dict)
        self.assertEqual(rating1, "Full Marks")
        self.assertEqual(rating2, "No Marks")
        
