import React from 'react';
import { shallow } from 'enzyme';
import '../../test/setUpTests';

import Selector from './Selector';

describe('<Selector />', () => {
  it('component mounts with options', async () => {
    const myOptions = ['All Instuctors', 'Bill', 'Joan'];
    const component = shallow(
      <Selector
        options={myOptions}
        labelText="Instructors:"
        selectorValue="All Instructors"
        selectorIdentifier="compareAssignments-sections"
        dispatch={jest.fn()}
      />,
    );
    expect(component.props().children.length).toEqual(3); // check that three options are rendered
    expect(component.props().renderLabel).toEqual('Instructors:');
  });
});
