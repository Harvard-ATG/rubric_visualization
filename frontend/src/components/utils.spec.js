import {
  flatData,
  pivotHeatMapData,
  pivotHeatMapDataNoSections,
  truncateString,
  countDenormalizedDataPoints,
  uniqueStudentCriteria,
} from './utils';

import { testBusinessData } from '../test/test-payload';

const heatMapData = pivotHeatMapData(testBusinessData);

describe('utility functions', () => {
  it('returns true when criterion can be flattened', () => {
    // in this set of datapoints, all rating descriptions are the same
    const rubric = heatMapData[0].dataPoints;
    expect(flatData(rubric)).toEqual(true);
  });

  it('returns false when criterion cannot be flattened', () => {
    // in this set of datapoints, all rating descriptions are NOT the same
    const rubric = heatMapData[1].dataPoints;
    rubric[0][0].ratingDescription = 'Not a standard description';
    expect(flatData(rubric)).toEqual(false);
  });

  it('countDenormalizedDataPoints() counts the denormalized data', () => {
    const count = countDenormalizedDataPoints(testBusinessData.denormalized_data, true);
    expect(Object.keys(count).length).toEqual(193);
    const filteredDenormData = testBusinessData.denormalized_data.filter(uniqueStudentCriteria);
    const countNoSections = countDenormalizedDataPoints(filteredDenormData, false);
    expect(Object.keys(countNoSections).length).toEqual(31);
  });

  it('aggregates data with pivotHeatMapDataNoSections', () => {
    const noSections = pivotHeatMapDataNoSections(testBusinessData);
    // filter for a specific piece of data that we know how it should be aggregated
    const noSectionsFiltered = noSections.filter((obj) => obj.assignmentId === 378503);
    expect(noSectionsFiltered.length).toEqual(1);
    expect(noSectionsFiltered[0].sectionId).toEqual(undefined);
    expect(noSectionsFiltered[0].totalAssessments).toEqual(77);
    expect(noSectionsFiltered[0].dataPoints[0][0].count).toEqual(0);
    expect(noSectionsFiltered[0].dataPoints[0][1].count).toEqual(4);
    expect(noSectionsFiltered[0].dataPoints[0][2].count).toEqual(73);
  });

  it('truncateString() truncates when a string is too long', () => {
    // in this set of datapoints, all rating descriptions are NOT the same
    const sampleString = 'This is the sample string';
    const truncatedString = truncateString(sampleString, 15); // the ...
    const notTruncatedString = truncateString(sampleString, 100);
    expect(truncatedString).toEqual('This is the ...');
    expect(notTruncatedString).toEqual('This is the sample string');
  });
});
