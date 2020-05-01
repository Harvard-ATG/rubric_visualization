import React from 'react';
import { shallow } from 'enzyme';
import '../../test/setUpTests';

import TopNav from './TopNav';
import CompareAssignmentsTab from '../CompareAssignmentsTab/CompareAssignmentsTab';

describe('<TopNav />', () => {
  it('<TopNav /> renders appropriate children', async () => {
    const component = await shallow(<TopNav />);
    expect(component.find(CompareAssignmentsTab).length).toEqual(1);
  });
});
