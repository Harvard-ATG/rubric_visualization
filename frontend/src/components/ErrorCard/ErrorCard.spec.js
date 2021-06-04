import React from 'react';
import { mount } from 'enzyme';
import '../../test/setUpTests';

import { AppContext, initialState } from '../AppState';
import ErrorCard from './ErrorCard';

describe('<ErrorCard />', () => {
  it('ErrorCard displays the Canvas API error', async () => {
    const badRequest = {
      ...initialState,
      processing: {
        ...initialState.processing,
        loadingBusinessData: false,
        error: true,
        errorMessage: 'Bad Request',
      },
    };

    const card = (
      <AppContext.Provider value={{ state: badRequest, dispatch: jest.fn() }}>
        <ErrorCard />
      </AppContext.Provider>
    );
    const component = await mount(card);
    expect(component.text()).toEqual(expect.stringContaining('There was an issue requesting data from the Canvas API'));
  });

  it('ErrorCard displays the No Content error', async () => {
    const noContent = {
      ...initialState,
      processing: {
        ...initialState.processing,
        loadingBusinessData: false,
        error: true,
        errorMessage: 'No Content',
      },
    };

    const card = (
      <AppContext.Provider value={{ state: noContent, dispatch: jest.fn() }}>
        <ErrorCard />
      </AppContext.Provider>
    );
    const component = await mount(card);
    expect(component.text()).toEqual(expect.stringContaining('The data supplied from Canvas was either insufficient, or'));
  });

  it('ErrorCard displays the unexpected error', async () => {
    const unexpectedError = {
      ...initialState,
      processing: {
        ...initialState.processing,
        loadingBusinessData: false,
        error: true,
        errorMessage: 'Some Unexpected Application Error',
      },
    };

    const card = (
      <AppContext.Provider value={{ state: unexpectedError, dispatch: jest.fn() }}>
        <ErrorCard />
      </AppContext.Provider>
    );
    const component = await mount(card);
    expect(component.text()).toEqual(expect.stringContaining('There was an unexpected error fulfilling your request.'));
  });
});
