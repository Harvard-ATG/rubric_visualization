import React from 'react';
import { shallow } from 'enzyme';
import '../../test/setUpTests';
import { Checkbox } from '@instructure/ui';

import CheckList from './CheckList';

describe('<CheckList />', () => {
  it('should show the "all" checkbox is checked when all options are checked', async () => {
    const component = shallow(
      <CheckList
        list={['493826', '493821', '495826']}
        listType="sections"
        checkListKey="sections"
        checkListChecked={['493826', '493821', '495826']}
        dispatch={jest.fn()}
      />,
    );
    expect(component.find(Checkbox).at(0).props().checked).toBe(true);
    expect(component.find(Checkbox).at(0).props().indeterminate).toBe(false);
  });

  it('should be indeterminate when only some options are checked', async () => {
    const component = shallow(
      <CheckList
        list={['493826', '493821', '495826']}
        listType="sections"
        checkListKey="sections"
        checkListChecked={['493826', '495826']}
        dispatch={jest.fn()}
      />,
    );
    expect(component.find(Checkbox).at(0).props().indeterminate).toBe(true);
    expect(component.find(Checkbox).at(0).props().checked).toBe(false);
  });

  it('should show the "all" checkbox is unchecked when all options are unchecked', async () => {
    const component = shallow(
      <CheckList
        list={['493826', '493821', '495826']}
        listType="sections"
        checkListKey="sections"
        checkListChecked={[]}
        dispatch={jest.fn()}
      />,
    );
    expect(component.find(Checkbox).at(0).props().indeterminate).toBe(false);
    expect(component.find(Checkbox).at(0).props().checked).toBe(false);
  });
});
