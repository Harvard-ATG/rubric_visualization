import React from 'react';
import { mount } from 'enzyme';
import '../../test/setUpTests';
import { testBusinessData } from '../../test/test-payload';

import CompareAssignmentsTab from './CompareAssignmentsTab';
import AssignmentCard from '../VisCards/AssignmentCard';
import { AppContext, initialState, newState } from '../AppState';
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
      payload: testBusinessData,
      loaded: true,
      compareAssignments: {
        ...initialState.compareAssignments,
        heatMapData: pivotHeatMapData(testBusinessData),
      },
    };
    
    const nState = {
      ...newState,
      businessData: testBusinessData,
      processing: {
        ...newState.processing,
        loading: false,
      },
      visualizationData: {
        ...newState.visualizationData,
        heatMapData: pivotHeatMapData(testBusinessData),
      }
    };

    const component = await mount(
      <AppContext.Provider value={{ state: nState, dispatch: jest.fn() }}>
        <CompareAssignmentsTab />
      </AppContext.Provider>,
    );
    expect(component.find(AssignmentCard).length).toEqual(3);
  });
});
