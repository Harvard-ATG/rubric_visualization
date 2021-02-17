import { flatData, pivotHeatMapData, squashRubricData } from './utils';

import { testBusinessData, testHeatMapDataMultipleSections } from '../test/test-payload';

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
    expect(flatData(rubric)).toEqual(false);
  });

  it('removes sections with squashRubricData', () => {
    expect(testHeatMapDataMultipleSections.length).toEqual(6);
    expect(testHeatMapDataMultipleSections[0]).toHaveProperty('sectionId');
    const clonedData = JSON.parse(JSON.stringify(testHeatMapDataMultipleSections));
    const squashedHeatMapData = squashRubricData(clonedData);
    // filter for a specific piece of data that we know how it should be aggregated
    const squashedObject = squashedHeatMapData.filter((obj) => obj.assignmentId === 222064);
    expect(squashedHeatMapData.length).toEqual(3);
    expect(squashedObject[0].sectionId).toEqual(undefined);
    expect(squashedObject[0].totalAssessments).toEqual(20);
    expect(squashedObject[0].dataPoints[0][0].count).toEqual(14);
  });
});
