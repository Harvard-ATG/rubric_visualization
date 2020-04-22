import React from 'react';
import { mount } from 'enzyme';
import "../../test/setUpTests";

import CompareAssignmentsTab from './CompareAssignmentsTab';
import AssignmentCard from '../VisCards/AssignmentCard';

describe('<CompareAssignmentsTab />', () => {

  it('component mounts with vis cards', async () => {
    const component = mount(<CompareAssignmentsTab />);
    expect(component.find(AssignmentCard).length).toEqual(2);
  });

});
