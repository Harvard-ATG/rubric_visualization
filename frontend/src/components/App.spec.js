import React from 'react';
import axe from 'axe-core';
import { mountToDoc } from '../test/test-helpers';

import App from './App';

describe('My Test Suite', () => {
  it('My Test Case', () => {
    expect(true).toEqual(true);
  });

  it('Tests with axe-core', () => {
    const mockSuccessResponse = { data: { assignments: [], submissions: [], students: ['bill', 'sue'] } };
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise,
    })
    global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);
    global.django = {
      randomValue: 42,
    };
    const appComponent = mountToDoc(<App />);
    const appNode = appComponent.getDOMNode();
    const config = { rules: {} };

    axe.run(appNode, config, (err, { violations }) => {
      expect(err).toBe(null);
      expect(violations).toHaveLength(0);
      done();
    });
    global.fetch.mockClear();
    delete global.fetch;
  });
});
