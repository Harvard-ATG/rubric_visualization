import React from 'react';
import { shallow } from 'enzyme';
import "../../test/setUpTests";
import { SimpleSelect } from '@instructure/ui-simple-select/lib/SimpleSelect';

import Selector from './Selector';

describe('<Selector />', () => {

  it('component mounts with options', async () => {
    const myOptions = ['All Instuctors','Bill','Joan'];
    const label = "Instructors:";
    const component = shallow(<Selector options={myOptions} labelText="Instructors:" />); 
    expect(component.props().children.length).toEqual(3); // check that three options are rendered 
    expect(component.props().renderLabel).toEqual("Instructors:");
  });

});
