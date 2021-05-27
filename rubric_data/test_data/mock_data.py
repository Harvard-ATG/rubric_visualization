MOCK_SECTIONS_LIST = [
    {
        "id": 0,
        "name": "Section 001",
        "students": [
            {
                "id": 123,
                "sortable_name": "Beeper, Scoot"
            },
            {
                "id": 456,
                "sortable_name": "Toolman, Tim"
            }
        ]
    },
    {
        "id": 1,
        "name": "Section 002",
        "students": [
            {
                "id": 123,
                "sortable_name": "Beeper, Scoot"
            },
            {
                "id": 456,
                "sortable_name": "Toolman, Tim"
            },
            {
                "id": 789,
                "sortable_name": "Taylor, Joy"
            }
        ]
    },
]

MOCK_CRITERIA_DICT = {
    "2334_396" : {
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
    "2334_5661" : {
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


MOCK_ASSIGNMENTS_LIST = [
    {
        "id": 123,
        "name": "First Assignment",
        "due_at": None,
        "rubric": [
            {
                "id": "_111",
                "description": "Writing",
                "ratings": [
                    {
                        "id": "021",
                        "points": 4,
                        "description": "Not Good enough"
                    },
                    {
                        "id": "blank_2",
                        "points": 8,
                        "description": "Good enough"
                    },
                ]
            },
            {
                "id": "_222",
                "description": "Speach",
                "ratings": [
                    {
                        "id": "120",
                        "points": 4,
                        "description": "Not Good enough"
                    },
                    {
                        "id": "blank",
                        "points": 8,
                        "description": "Good enough"
                    },
                ]
            }
        ]
    },
    {
        "id": 345,
        "name": "Second Assignment",
        "due_at": None,
        "rubric": [
            {
                "id": "_111",
                "description": "Writing",
                "ratings": [
                    {
                        "id": "021",
                        "points": 4,
                        "description": "Not Good enough"
                    },
                    {
                        "id": "blank_2",
                        "points": 8,
                        "description": "Good enough"
                    },
                ]
            },
            {
                "id": "_021",
                "description": "Pizza",
                "ratings": [
                    {
                        "id": "120",
                        "points": 4,
                        "description": "Not Good enough"
                    },
                    {
                        "id": "blank",
                        "points": 8,
                        "description": "Good enough"
                    },
                ]
            }
        ]
    }
]

MOCK_SUBMISSONS_LIST = [
    {
        "assignment_id": 123,
        "submissions": [
            {
                "user_id": 123,
                "rubric_assessment": {
                    "_111": {
                        "rating_id": "blank",
                        "comments": "",
                        "points": 6.5
                    },
                    "_222": {
                    "rating_id": "_9061",
                     "comments": "",
                    "points": 6.0
                    }
                }
            },
            {
                "user_id": 789,
                "rubric_assessment": {
                    "_111": {
                        "rating_id": "blank",
                        "comments": "",
                        "points": 6.5
                    },
                    "_222": {
                    "rating_id": "_9061",
                     "comments": "",
                    "points": 6.0
                    }
                }
            }

        ]
    },
    {
        "assignment_id": 345,
        "submissions": [
            {
                "user_id": 123,
                "rubric_assessment": {
                    "_111": {
                        "rating_id": "blank",
                        "comments": "",
                        "points": 2
                    },
                    "_021": {
                        "rating_id": "_9061",
                        "comments": "",
                        "points": 6.0
                    }
                }
            },
            {
                "user_id": 789,
                "rubric_assessment": {
                    "_111": {
                        "rating_id": "blank",
                        "comments": "",
                        "points": 6.5
                    },
                    "_021": {
                        "rating_id": "_9061",
                        "comments": "",
                        "points": 6.0
                    }
                }
            }
        ]
    }
]