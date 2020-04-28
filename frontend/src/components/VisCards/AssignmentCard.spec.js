import React from 'react';
import { mount } from 'enzyme';
import '../../test/setUpTests';

import AssignmentCard from './AssignmentCard';

describe('<AssignmentCard />', () => {
  it('component mounts with options', async () => {
    const card = (
      <AssignmentCard
        assignmentName="Roanoke Colony Writeup"
        dueDate={2}
        observations={['90% completion rate', '20% improvement in "Sources" over prior assignment']}
      />
    );
    const component = await mount(card);
    expect(component.find('li').length).toEqual(2);
  });
});
