import React from 'react';
import { mount } from 'enzyme';
import '../../test/setUpTests';
import { testBusinessData } from '../../test/test-payload';

import AssignmentCard from './AssignmentCard';

import { pivotHeatMapData } from '../utils';

const heatMapData = pivotHeatMapData(testBusinessData);

describe('<AssignmentCard />', () => {
  it('component mounts with options', async () => {
    const rubric = heatMapData[0];
    const card = (
      <AssignmentCard
        key={`assignmentCard-${rubric.assignmentId}`}
        assignmentName={rubric.name}
        dueDate={rubric.dueDate}
        observations={['90% completion rate', '20% improvement in "Sources" over prior assignment']}
        dataPoints={rubric.dataPoints}
        assignmentId={rubric.assignmentId}
      />
    );
    const component = await mount(card);
    expect(component.find('li').length).toEqual(2);
  });
});
