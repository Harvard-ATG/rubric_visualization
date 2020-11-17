// for eslint purposes, keep more than one function in this file
// export const emptyUtil = () => {};

/**
 * Test if the datapoints to be charted can be flattened.
 * @param {array} data The datapoints to iterate over for visualization.
 * @returns {boolean} return if every array of rating descriptions is the same
 */
export const flatData = (data) => {
  const ratingSets = data.map((crit) => [...new Set(crit.map((d) => d.ratingDescription))]);
  return ratingSets.every((curr) => curr.toString() === ratingSets[0].toString());
};

export const pivotHeatMapData = (payload) => {
  // this transformation takes into account that not all criteria have the same rating set

  const allRubrics = payload.assignments.map((assignment) => {
    const rubric = {
      assignmentId: assignment.id,
      name: assignment.name,
      dueDate: assignment.due_at,
      totalAssessments: payload.submissions.reduce((acc, curr) => {
        if (assignment.id === curr.assignment_id) {
          return acc + curr.submissions.length;
        }
        return acc;
      }, 0),
      dataPoints: assignment.rubric.map((criterion) => criterion.ratings.map((rating) => {
        const dataPoint = {
          criterionId: criterion.id,
          criterion: criterion.description,
          ratingDescription: rating.description,
          maxPoints: rating.points,
          count: payload.denormalized_data.reduce((acc, curr) => (
            acc + Number(curr.criterion_id === criterion.id
              && curr.rating === rating.description
              && curr.assignment_id === assignment.id)), 0),
        };
        return dataPoint;
      })),
    };

    rubric.dataPoints.forEach((criterion) => {
      criterion.sort((a, b) => a.maxPoints < b.maxPoints);
      criterion.forEach((rating) => {
        rating.value = rubric.totalAssessments !== 0
          ? (Number(((rating.count / rubric.totalAssessments) * 100).toFixed()))
          : undefined;
      });
    });

    return rubric;
  });
  return allRubrics;
};

export const pivotHeatMapDataWithSections = (payload, sections) => {
  // this transformation takes into account that not all criteria have the same rating set

  // create a student lookup for student_id(key) and section_id(value) for later use
  const studentLookup = Object.assign(...payload.denormalized_data.map((dp) => {
    const { student_id: studentId, section_id: sectionId } = dp;
    // apparrently the [] is needed around a computed value to assign object keys
    return { [studentId]: sectionId };
  }));

  const allRubrics = payload.assignments.map((assignment) => {
    const rubrics = [];
    sections.forEach((section) => {
      const rubric = {
        assignmentId: assignment.id,
        name: assignment.name,
        dueDate: assignment.due_at,
        sectionId: section,
        totalAssessments: payload.submissions.map((sub) => sub.submissions)
          .flat()
          .reduce((acc, curr) => (
            acc + Number(assignment.id === curr.assignment_id
              && studentLookup[curr.user_id] === section)
          ), 0),
        dataPoints: assignment.rubric.map((criterion) => criterion.ratings.map((rating) => {
          const dataPoint = {
            criterionId: criterion.id,
            criterion: criterion.description,
            ratingDescription: rating.description,
            maxPoints: rating.points,
            count: payload.denormalized_data.reduce((acc, curr) => (
              acc + Number(curr.criterion_id === criterion.id
                && curr.rating === rating.description
                && curr.assignment_id === assignment.id
                && curr.section_id === section)), 0),
          };
          return dataPoint;
        })),
      };

      rubric.dataPoints.forEach((criterion) => {
        criterion.sort((a, b) => a.maxPoints < b.maxPoints);
        criterion.forEach((rating) => {
          rating.value = rubric.totalAssessments !== 0
            ? (Number(((rating.count / rubric.totalAssessments) * 100).toFixed()))
            : undefined;
        });
      });

      rubrics.push(rubric);
    });
    return rubrics.flat();
  });
  return allRubrics.flat();
};
