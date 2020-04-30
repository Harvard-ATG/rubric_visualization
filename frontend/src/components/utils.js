export const pivotHeatMapData = (payload) => {
  // this transformation takes into account that not all criteria have the same rating set
  let allRubircs = payload.assignments.map((assignment) => {
    let rubric = {
      assignmentId: assignment.id,
      name: assignment.name,
      dueDate: assignment.due_at,
      totalAssessments: payload.submissions.reduce((acc, curr) => {
        if (assignment.id === curr.assignment_id) {
          return acc + curr.submissions.length;
        }
        return acc;
      }, 0),
      dataPoints: assignment.rubric.map((criterion) => {
        return criterion.ratings.map((rating) => {  
          let dataPoint = {
            criterionId: criterion.id,
            criterion: criterion.description,
            ratingDescription: rating.description,
            maxPoints: rating.points,
            count: payload.denormalized_data.reduce((acc, curr) => {
              // return accumulator(int) + expression (true-false ...or... 1-0)
              return (acc + (curr.criterion_id === criterion.id &&
                curr.rating === rating.description &&
                curr.assignment_id === assignment.id));
            }, 0)
          }    
          return dataPoint;
        });
      })
    }
    
    rubric.dataPoints.forEach((criterion) => {
      criterion.forEach((rating) => {
        rating['value'] = rubric.totalAssessments !== 0
          ? (parseInt(((rating.count / rubric.totalAssessments) * 100).toFixed()))
          : undefined;
      });
    });
    
    return rubric;
  });
  return allRubircs;
};
