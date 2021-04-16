import {
  flatData,
  pivotHeatMapData,
  pivotHeatMapDataNoSections,
  sectionIdNameMap,
  truncateString,
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

  it('sectionIdNameMap a map of objects with sectionId and formatted sectionName', () => {
    const sectionData = [
      {
        sis_section_id: 1,
        name: 'Something Something 01',
        students: [1, 2, 3, 4, 5],
        purpose: 'Not sure',
      },
      {
        sis_section_id: 2,
        name: 'Something Something D001',
        students: [1],
        purpose: 'Totally sure',
      },
      {
        sis_section_id: 3,
        name: 'Something Something D002',
        students: [2, 3, 4, 5],
        purpose: 'Somewhat sure',
      },
    ];
    const sectionsMap = sectionIdNameMap(sectionData);
    expect(sectionsMap.length).toEqual(3);
    expect(sectionsMap[0].sectionName).toEqual('01');
    expect(sectionsMap[1].sectionName).toEqual('D001');
    expect(sectionsMap[2].sectionId).toEqual(3);
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
