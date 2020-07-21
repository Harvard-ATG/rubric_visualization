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
