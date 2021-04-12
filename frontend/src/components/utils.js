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

  // create a student lookup for student_id(key) and section_id(value) for later use
  const studentLookup = payload.denormalized_data.reduce((acc, curr) => (
    Object.assign(acc, { [curr.student_id]: curr.section_id })), {});

  let student_sections = {};
  payload.denormalized_data.forEach((item) => {
    if(student_sections.hasOwnProperty(item.student_id)) {
      if(student_sections[item.student_id].indexOf(item.section_id) < 0) {
        student_sections[item.student_id].push(item.section_id);
      }
    } else {
      student_sections[ [item.student_id] ] = [item.section_id];
    }
  });

  // extract the sections for use
  const sections = payload.sections.map((s) => {
    return [
      s.sis_section_id,
      s.name.split(' ').pop()
    ]
  });

  const allRubrics = payload.assignments.map((assignment) => {
    const rubrics = [];
    sections.forEach((sectionArray) => {
      const rubric = {
        assignmentId: assignment.id,
        name: assignment.name,
        dueDate: assignment.due_at,
        sectionId: sectionArray[0],
        sectionName: sectionArray[1],
        totalAssessments: payload.submissions.map((sub) => sub.submissions)
          .flat()
          .reduce((acc, curr) => {
            if(assignment.id === curr.assignment_id && student_sections[curr.user_id]) {
              if(student_sections[curr.user_id].indexOf(sectionArray[0]) > -1) {
                acc += 1;
              }
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
              acc + Number(curr.criterion_id === `${assignment.id}${criterion.id}`
                && curr.rating === rating.description
                && curr.section_id === sectionArray[0])), 0),
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
      if(rubric.totalAssessments !== 0) {
        rubrics.push(rubric);
      }
    });
    return rubrics.flat();
  });
  return allRubrics.flat();
};

/**
 * Test if the datapoints to be charted can be flattened.
 * @param {array} data The rubric data returned by the canvas api.
 * To see the data, you may run testBusinessData found in test-payload.js through pivotHeatMapData
 * @returns {array} returns squashed rubric data
 */
export const squashRubricData = (data) => {
  // Transform an array of rubrics that represent data points for a particular
  // section and assignment such that the rubric represents data points for a
  // particular assignment.
  // In other words, group the rubrics by assignment and aggregate the section statistics.

  // first create an object of assignments, with assignmentId as the key
  // aggregate the totalAssessments, and counts of all sections
  const asgnmntOb = {};
  data.forEach((a) => {
    if (!(a.assignmentId in asgnmntOb)) {
      asgnmntOb[a.assignmentId] = {
        totalAssessments: a.totalAssessments,
        dataPoints: a.dataPoints.reduce((acc, curr) => Object.assign(acc, ...curr.map((dp) => ({ [`${dp.criterionId}-${dp.ratingDescription}`]: dp.count }))), {}),
      };
    } else {
      asgnmntOb[a.assignmentId].totalAssessments += a.totalAssessments;
      a.dataPoints.forEach((arr) => {
        arr.forEach((dp) => {
          asgnmntOb[a.assignmentId].dataPoints[`${dp.criterionId}-${dp.ratingDescription}`] += dp.count;
        });
      });
    }
  });

  // Using the keys from the above asgnmntOb object, run a map to create the array to return
  // since we are using the above object, each assignment will only have one entry
  const returnValue = Object.keys(asgnmntOb).map((asngmntKey) => {
    let ob;

    const reAssignOb = (val) => {
      // function to reassign the dataPoints using aggreation from above
      val.dataPoints.forEach((arr) => {
        arr.forEach((dp) => {
          dp.count = asgnmntOb[asngmntKey].dataPoints[`${dp.criterionId}-${dp.ratingDescription}`];
          dp.value = Math.round(((dp.count / ob.totalAssessments) * 100));
        });
        arr.sort((a, b) => a.maxPoints < b.maxPoints);
      });
    };

    for (let i = 0; i < data.length; i += 1) {
      if (data[i].assignmentId.toString() === asngmntKey) {
        // first, copy the original data
        ob = data[i];
        // delete reference to the sectionId
        delete ob.sectionId;
        // update the totalAssessments from aggregation
        ob.totalAssessments = asgnmntOb[asngmntKey].totalAssessments;
        // update the dataPoints
        reAssignOb(ob);
        break;
      }
    }
    return ob;
  });

  return returnValue;
};


export const truncateString = (str, len) => {
  if(str.length > len) {
    return `${str.substring(0, len - 3)}...`;
  }
  return str;
};