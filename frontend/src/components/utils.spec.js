import { flatData, pivotHeatMapData } from './utils';

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
    expect(flatData(rubric)).toEqual(false);
  });
});
