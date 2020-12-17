import { flatData, pivotHeatMapData, squashRubricData } from './utils';

import { testBusinessData } from '../test/test-payload';

const heatMapData = pivotHeatMapData(testBusinessData);
const clonedData = JSON.parse(JSON.stringify(heatMapData));
const squashedHeatMapData = squashRubricData(clonedData);

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
    expect(squashedHeatMapData.length).toEqual(3);
    expect(squashedHeatMapData[0].sectionId).toEqual(undefined);
  });
});
