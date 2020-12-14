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

export const pivotHeatMapData = (payload, sections) => {
  // this transformation takes into account that not all criteria have the same rating set

  // create a student lookup for student_id(key) and section_id(value) for later use
  const studentLookup = payload.denormalized_data.reduce((acc, curr) => (
    Object.assign(acc, { [curr.student_id]: curr.section_id })), {});

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
            ? Math.round(((rating.count / rubric.totalAssessments) * 100))
            : undefined;
        });
      });

      rubrics.push(rubric);
    });
    return rubrics.flat();
  });
  return allRubrics.flat();
};


export const squashRubricData = (data) => {
  
  let asgnmntOb = {};
  data.forEach((a) => {
    if(!(a.assignmentId in asgnmntOb)) {
      asgnmntOb[a.assignmentId] = {
        totalAssessments: a.totalAssessments,
        dataPoints: a.dataPoints.reduce((acc, curr) => {
          return Object.assign(acc, ...curr.map((dp) => {
            return {[`${dp.criterionId}-${dp.ratingDescription}`]: dp.count};
          }));
        }, {})
      }
    } else {
      asgnmntOb[a.assignmentId].totalAssessments += a.totalAssessments;
      a.dataPoints.forEach((arr) => {
        arr.forEach((dp) => {
          asgnmntOb[a.assignmentId].dataPoints[`${dp.criterionId}-${dp.ratingDescription}`] += dp.count;
        });
      });
    }
  });
  
  let returnValue = Object.keys(asgnmntOb).map((asngmntKey) => {
    let ob;
    for(let i = 0; i < data.length; i++){
      if(data[i].assignmentId.toString() === asngmntKey) {
        ob = data[i];
        delete ob.sectionId;
        ob.totalAssessments = asgnmntOb[asngmntKey].totalAssessments;
        ob.dataPoints.forEach((arr) => {
          arr.forEach((dp) => {
            dp.count = asgnmntOb[asngmntKey].dataPoints[`${dp.criterionId}-${dp.ratingDescription}`];
            dp.value = Math.round(((dp.count / ob.totalAssessments) * 100));
          });
          arr.sort((a, b) => a.maxPoints < b.maxPoints);
        });
        break;
      }
    }
    return ob;
  });

  return returnValue;
  
};
