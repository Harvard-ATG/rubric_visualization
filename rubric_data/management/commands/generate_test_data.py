from django.core.management.base import BaseCommand

import argparse
import json
import random
import string

class Command(BaseCommand):
    help = 'Scrubs real data of sensitive information'

    def add_arguments(self, parser):
        parser.add_argument("infile", type=argparse.FileType('r'), help="JSON file to be scrubbed")

    def handle(self, *args, **options):
        """Writes payload data scrubbed of sensitive information"""
        example_json = json.load(options['infile'])

        student_scrub_map = {}
    
        students, sections, rubric_assignments, denormalied_data = example_json
        students_dict = example_json[students]
        denormalied_data_list = example_json[denormalied_data]

        random_int_sample = random.sample(range(10000, 90000), k=len(students_dict))

        for idx, (k, v) in enumerate(students_dict.items()):
            student_scrub_map[k] = {
                "old_id": v["id"],
                "new_id": random_int_sample[idx],
                "new_name": self.random_sortable_name()
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

        self.stdout.write(self.style.SUCCESS("Scrubbed data found in 'test_data.json'"))

        return 0

    def random_string(self):
        letters = string.ascii_lowercase
        return ( ''.join(random.choice(letters) for i in range(7)) )

    def random_sortable_name(self):
        return f"{self.random_string()}, {self.random_string()}"
