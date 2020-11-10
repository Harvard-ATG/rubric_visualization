from django.conf import settings
from django.test import TestCase
from .views import denormalize

import json


class ViewTests(TestCase):
        
    def test_denormalize(self):
        with open(settings.PROJECT_ROOT + '/rubric_data/test_data/data.json') as json_file:
            data = json.loads(json_file.read())
            denormalized_data = denormalize(data)
            self.assertIs(type(denormalized_data), list)
            self.assertEqual(len(denormalized_data), 120)
            self.assertEqual(len(denormalized_data[0]), 9)
            
    def test_denormalize_none(self):
        denormalized_data = denormalize(None)
        self.assertEqual(denormalized_data, [])
        
