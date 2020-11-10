import React from 'react';
import axe from 'axe-core';
import { mockFetchSuccess, mountToDoc } from '../test/test-helpers';
import { testBusinessData } from '../test/test-payload';

import App from './App';

describe('My Test Suite', () => {
  it('Just passes', () => {
    expect(true).toEqual(true);
  });

  it('Tests with axe-core', async (done) => {
    global.django = { course_id: 12345 };
    jest.setTimeout(10000);
    global.fetch = await mockFetchSuccess(testBusinessData);
    const appComponent = await mountToDoc(<App />);
    const appNode = appComponent.getDOMNode();
    const config = { rules: {} };

    axe.run(appNode, config, (err, { violations }) => {
      expect(err).toBe(null);
      expect(violations).toHaveLength(1);
      done();
    });
    global.fetch.mockClear();
    delete global.fetch;
  });
});
