/**
 * Test if the datapoints to be charted can be flattened.
 * @param {array} data The datapoints to iterate over for visualization.
 * @returns {boolean} return if every array of rating descriptions is the same
 */
export const flatData = (data) => {
  const ratingSets = data.map((crit) => [...new Set(crit.map((d) => d.ratingDescription))]);
  return ratingSets.every((curr) => curr.toString() === ratingSets[0].toString());
};

/**
 * filter test to filter for unique student_id and criterion_id combinations
 * @param {object} curr - the current object
 * @param {int} index - the current index in the original array
 * @param {array} arr - the original array
 * @returns boolean
 */
export const uniqueStudentCriteria = (curr, index, arr) => {
  const firstIndex = arr.findIndex((item) => (
    item.student_id === curr.student_id
      && item.criterion_id === curr.criterion_id
  ));
  return firstIndex === index;
};

// add function to calculate "value" for refactoring
/**
 * Mutates the 'dataPoints' array to sort criterion and calculate the 'value' attribute
 * @param {array} dataPoints - array of array of criterion objects
 * @param {int} totalAssessments - total number of assessments for the assignment
 * @returns array
 */
const calculateDataPointValues = (dataPoints, totalAssessments) => {
  if (totalAssessments && totalAssessments !== 0) {
    const returnData = dataPoints.map((criterion) => {
      criterion.sort((a, b) => a.maxPoints < b.maxPoints);
      criterion.forEach((rating) => {
        rating.value = Math.round(((rating.count / totalAssessments) * 100));
      });
      return criterion;
    });
    return returnData;
  }
  return null;
};

/* eslint-disable no-param-reassign */
/**
 * Returns total assessments for a rubric by summing the counts of one criterion
 * @param {array} rubric data from a single rubric
 * @returns int
 */
const sumTotalAssessments = (rubric) => (
  rubric.dataPoints[0].reduce((acc, curr) => {
    acc += curr.count;
    return acc;
  }, 0)
);
/* eslint-enable no-param-reassign */

/* eslint-disable no-param-reassign */
/**
 * Takes an array of denormalized datapoints, as well as a bool of whether we should
 * respect sections, and returns an object of keys with counts
 * @param {array} data array of dataPoint objects
 * @param {boolean} withSections should the count respect sections
 * @returns object
 */
export const countDenormalizedDataPoints = (data, withSections) => data.reduce((acc, curr) => {
  const rating = curr.rating.replace(/\s/g, '');
  const countKey = withSections
    ? `${curr.criterion_id}${rating}${curr.section_id}`
    : `${curr.criterion_id}${rating}`;
  if (Object.prototype.hasOwnProperty.call(acc, countKey)) {
    acc[countKey] += 1;
  } else {
    acc[countKey] = 1;
  }
  return acc;
}, {});
/* eslint-enable no-param-reassign */

/**
 * Takes the businessData, filters the denormalized data to make sure students do not
 * appear in more than one section. Returns an array of rubric data based on assignment.
 * @param {object} businessData all the data that is provided to state.businessData
 * @returns array
 */
export const pivotHeatMapDataNoSections = (businessData) => {
  // filter denormalized data so students dont appear in more than one section
  // TODO : filteredDenormalizedData is O(n^2) and could be optimized perhaps with a hash table?
  const filteredDenormalizedData = businessData.denormalized_data.filter(uniqueStudentCriteria);
  const dataPointCounts = countDenormalizedDataPoints(filteredDenormalizedData, false);
  const assignments = Object.values(businessData.rubric_assignments);

  const allRubrics = assignments.map((assignment) => {
    const rubric = {
      assignmentId: assignment.id,
      name: assignment.name,
      totalAssessments: 0,
      dataPoints: assignment.rubric.map((criterion) => criterion.ratings.map((rating) => {
        const dataPointCountKey = `${criterion.id}${rating.description.replace(/\s/g, '')}`;
        const dataPoint = {
          criterionId: criterion.id,
          criterion: criterion.description,
          ratingDescription: rating.description,
          maxPoints: rating.points,
          count: dataPointCounts[dataPointCountKey] ? dataPointCounts[dataPointCountKey] : 0,
        };
        return dataPoint;
      })),
    };
    rubric.totalAssessments = sumTotalAssessments(rubric);
    rubric.dataPoints = calculateDataPointValues(rubric.dataPoints, rubric.totalAssessments);
    return rubric;
  });
  return allRubrics;
};

/**
 * Takes the businessData, pivots the data to represent rubrics based on assigment and section.
 * @param {object} businessData all the data that is provided to state.businessData
 * @returns array
 */
export const pivotHeatMapData = (businessData) => {
  const sections = Object.values(businessData.sections);
  const assignments = Object.values(businessData.rubric_assignments);
  const dataPointCounts = countDenormalizedDataPoints(businessData.denormalized_data, true);

  const allRubrics = assignments.map((assignment) => {
    const rubrics = [];
    sections.forEach((sectionObject) => {
      const rubric = {
        assignmentId: assignment.id,
        name: assignment.name,
        dueDate: assignment.due_at,
        sectionId: sectionObject.id,
        sectionName: sectionObject.short_name,
        totalAssessments: 0,
        dataPoints: assignment.rubric.map((criterion) => criterion.ratings.map((rating) => {
          const dataPointCountKey = `${criterion.id}${rating.description.replace(/\s/g, '')}${sectionObject.id}`;
          const dataPoint = {
            criterionId: criterion.id,
            criterion: criterion.description,
            ratingDescription: rating.description,
            maxPoints: rating.points,
            count: dataPointCounts[dataPointCountKey] ? dataPointCounts[dataPointCountKey] : 0,
          };
          return dataPoint;
        })),
      };
      rubric.totalAssessments = sumTotalAssessments(rubric);
      rubric.dataPoints = calculateDataPointValues(rubric.dataPoints, rubric.totalAssessments);
      if (rubric.totalAssessments !== 0) {
        rubrics.push(rubric);
      }
    });
    return rubrics.flat();
  });
  return allRubrics.flat();
};

/**
 * Takes a string, and returns a truncated version if it is longer
 * than the specified length
 * @param {string} str string to test and truncate
 * @param {int} len max length of the string
 * @returns string
 */
export const truncateString = (str, len) => {
  if (str.length > len) {
    return `${str.substring(0, len - 3)}...`;
  }
  return str;
};
