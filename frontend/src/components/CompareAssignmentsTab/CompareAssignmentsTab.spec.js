import React from 'react';
import { mount } from 'enzyme';
import '../../test/setUpTests';
import { testBusinessData } from '../../test/test-payload';

import CompareAssignmentsTab from './CompareAssignmentsTab';
import AssignmentCard from '../VisCards/AssignmentCard';
import { AppContext, initialState } from '../AppState';
import { pivotHeatMapData } from '../utils';


describe('<CompareAssignmentsTab />', () => {
  it('component mounts with no vis cards', async () => {
    const component = await mount(
      <AppContext.Provider value={{ state: initialState, dispatch: jest.fn() }}>
        <CompareAssignmentsTab />
      </AppContext.Provider>,
    );
    expect(component.find(AssignmentCard).length).toEqual(0);
  });

  it('component mounts with three vis cards', async () => {
    const newState = {
      ...initialState,
      businessData: testBusinessData,
      processing: {
        ...initialState.processing,
        loadingBusinessData: false,
      },
      visualizationData: {
        ...initialState.visualizationData,
        heatMapData: pivotHeatMapData(testBusinessData),
      }
    };

    const component = await mount(
      <AppContext.Provider value={{ state: newState, dispatch: jest.fn() }}>
        <CompareAssignmentsTab />
      </AppContext.Provider>,
    );
    expect(component.find(AssignmentCard).length).toEqual(3);
  });
});
