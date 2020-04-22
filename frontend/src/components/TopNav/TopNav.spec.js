import React from 'react';
import { mount } from 'enzyme';
import "../../test/setUpTests";

import TopNav from './TopNav';
import CompareAssignmentsTab from '../CompareAssignmentsTab/CompareAssignmentsTab'

describe('<TopNav />', () => {
  
  it('component mounts', async () => {
    const component = await mount(<TopNav />);
    expect(component.find(CompareAssignmentsTab).length).toEqual(1);
  });
  
});
