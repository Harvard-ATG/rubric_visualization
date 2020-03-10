from django.test import TestCase
from .views import function_for_test_example


class ExampleTests(TestCase):
    
    def test_example_test(self):
        self.assertEqual(function_for_test_example(), 2)
        
