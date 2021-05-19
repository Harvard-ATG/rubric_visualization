## Rubric Visualization - Canvas GraphQL API
#### Table of Contents
- [Sections and Students](#sections-and-students)
- [Assignments with Rubrics](#assignments-with-rubrics)
- [Submissions with a Rubric Assessment](#submissions-with-a-rubric-assessment)

Given a course ID, we want to get the following information
#### Sections and Students
**ALL**:
 - **Sections**:
	- id
	- name
	- **students**:
	    - id
        - sortable_name

##### *Findings:*
- while we can get sections for a specific course, the Canvas GraphQL api does not have nesting of students within sections.
- however we can get all the students for a specific course and have sections nested inside of a student object/dict
##### *Examples:*

*Request: Nested Sections within Students*
```py
query MyQuery {
  course(id: "11111") {
    name
    _id
    usersConnection {
      nodes {
        name
        id
        enrollments(courseId: "11111") {
          section {
            id
            name
          }
        }
      }
    }
  }
}

```

*Response: Nested Sections within Students*

```json
{
  "data": {
    "course": {
      "name": "Fake Course Name",
      "_id": "11111",
      "usersConnection": {
        "nodes": [
          {
            "name": "Arthur Barrett",
            "id": "fak31d=",
            "enrollments": [
              {
                "section": {
                  "id": "fak3s3ction1d=",
                  "name": "Section 1"
                }
              }
            ]
          },
          {
            "name": "Vesna Tan",
            "id": "f4k31d2=",
            "enrollments": [
              {
                "section": {
                  "id": "f4k353ct1oN=",
                  "name": "another section"
                }
              }
            ]
          }
        ]
      }
    }
  }
}
```
___


#### Assignments with Rubrics
**ALL**:
  - **Assignments** (with rubrics):
	- id
	- name
	- due_at
	- rubric:
	- id
	- **criteria** (all):
	    - _id
	    - description
	    - longDescrition
	    - points
	    - **ratings** (all):
	        - _id
	        - description
	        - longDescription
	        - points

#### *Findings:*
- It is possible to query the nested `ratings` from `criteria` from `assignments`

##### Examples:
*Request: Nested Assignments with Rubrics*
```py
query MyQuery {
  course(id: "11111") {
    name
    _id
    id
    assignmentsConnection {
      nodes {
        id
        name
        rubric {
          id
          criteria {
            _id
            description
            points
            ratings {
              description
              longDescription
              points
              _id
            }
          }
        }
      }
    }
  }
}
```
*Response: Nested Assignments with Rubrics*
```json
{
  "data": {
    "course": {
      "name": "Fake Course Name",
      "_id": "11111",
      "id": "f4k3C0ur53id",
      "assignmentsConnection": {
        "nodes": [
          {
            "id": "f4k3Assignm3ntid=",
            "name": "Test Writing Assignment #3",
            "rubric": {
              "id": "f4k3rubricid=",
              "criteria": [
                {
                  "_id": "_9999",
                  "description": "SOURCES",
                  "points": 18,
                  "ratings": [
                    {
                      "description": "Mastery",
                      "longDescription": "",
                      "points": 18,
                      "_id": "fake"
                    },
                    {
                      "description": "Progressing",
                      "longDescription": "",
                      "points": 12,
                      "_id": "_999"
                    },
                    {
                      "description": "Emerging",
                      "longDescription": "",
                      "points": 6,
                      "_id": "fake_2"
                    }
                  ]
                },
                {
                  "_id": "_8888",
                  "description": "STRUCTURE",
                  "points": 18,
                  "ratings": [
                    {
                      "description": "Mastery",
                      "longDescription": "",
                      "points": 18,
                      "_id": "_3333"
                    },
                    {
                      "description": "Progressing",
                      "longDescription": "",
                      "points": 12,
                      "_id": "_4444"
                    },
                    {
                      "description": "Emerging",
                      "longDescription": "",
                      "points": 6,
                      "_id": "_5555"
                    }
                  ]
                }
              ]
            }
          },
          {
            "id": "f4k3Assignm3ntid2=",
            "name": "Test Writing Assignment #2",
            "rubric": {
              "id": "f4k3rubricid2=",
              "criteria": [
                {
                  "_id": "_000",
                  "description": "SOURCES",
                  "points": 18,
                  "ratings": [
                    {
                      "description": "Mastery",
                      "longDescription": "",
                      "points": 18,
                      "_id": "fake"
                    },
                    {
                      "description": "Progressing",
                      "longDescription": "",
                      "points": 12,
                      "_id": "_999"
                    },
                    {
                      "description": "Emerging",
                      "longDescription": "",
                      "points": 6,
                      "_id": "fake_2"
                    }
                  ]
                },
                {
                  "_id": "_8888",
                  "description": "STRUCTURE",
                  "points": 18,
                  "ratings": [
                    {
                      "description": "Mastery",
                      "longDescription": "",
                      "points": 18,
                      "_id": "_3333"
                    },
                    {
                      "description": "Progressing",
                      "longDescription": "",
                      "points": 12,
                      "_id": "_4444"
                    },
                    {
                      "description": "Emerging",
                      "longDescription": "",
                      "points": 6,
                      "_id": "_5555"
                    }
                  ]
                }
              ]
            }
          },
          {
            "id": "f4k3Assignm3ntid3=",
            "name": "AssignmentWithTestRubric",
            "rubric": null
          }
        ]
      }
    }
  }
}
```
___


#### Submissions with a Rubric Assessment

**ALL:**
- **Submissions (with a rubric assessment)**:
    - id
    - user_id
    - assignment_id
    - workflow_state
    - submission_type
    - **rubric_assessment:**
	    - _id
	    - **criterion (all):**
	        - _id
	        - description
	        - points
	        - **ratings (all):**
	            - _id
	            - description
	            - longDescription
	            - points

#### *Findings:*
- It is possible to query the nested `ratings` from `criterion` from `rubric assignments` from submissions
- We have to first query the course and then query into `submissionConnections`

*Request: Nested Submissions with a Rubric Assessment*
```
query MyQuery {
  course(id: "11111") {
    name
    _id
    id
    submissionsConnection {
      nodes {
        id
        user {
          id
        }
        assignment {
          id
        }
        submissionType
        rubricAssessmentsConnection {
          nodes {
            _id
            assessmentRatings {
              criterion {
                _id
                description
                points
                ratings {
                  _id
                  description
                  longDescription
                  points
                }
              }
            }
          }
        }
      }
    }
  }
}
```
*Response: Nested Submissions with a Rubric Assessment*
```json
{
  "data": {
    "course": {
      "name": "Fake Course Name",
      "_id": "11111",
      "id": "f4k3C0ur53id",
      "submissionsConnection": {
        "nodes": [
          {
            "id": "fak3Submi55ionsid",
            "user": {
              "id": "fak3us3r=="
            },
            "assignment": {
              "id": "fakea55ignm3ntid="
            },
            "submissionType": null,
            "rubricAssessmentsConnection": {
              "nodes": [
                {
                  "_id": "22222",
                  "assessmentRatings": [
                    {
                      "criterion": {
                        "_id": "_2222",
                        "description": "SOURCES",
                        "points": 18,
                        "ratings": [
                          {
                            "_id": "fake",
                            "description": "Mastery",
                            "longDescription": "",
                            "points": 18
                          },
                          {
                            "_id": "_999",
                            "description": "Progressing",
                            "longDescription": "",
                            "points": 12
                          },
                          {
                            "_id": "fake_2",
                            "description": "Emerging",
                            "longDescription": "",
                            "points": 6
                          }
                        ]
                      }
                    },
                    {
                      "criterion": {
                        "_id": "_0000",
                        "description": "STRUCTURE",
                        "points": 18,
                        "ratings": [
                          {
                            "_id": "_4444",
                            "description": "Mastery",
                            "longDescription": "",
                            "points": 18
                          },
                          {
                            "_id": "_2222",
                            "description": "Progressing",
                            "longDescription": "",
                            "points": 12
                          },
                          {
                            "_id": "_5555",
                            "description": "Emerging",
                            "longDescription": "",
                            "points": 6
                          }
                        ]
                      }
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    }
  }
}
```

[Back to top](#table-of-contents)