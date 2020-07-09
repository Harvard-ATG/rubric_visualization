import React from 'react';
import axe from 'axe-core';
import { mockFetchSuccess, mountToDoc } from '../test/test-helpers';

import App from './App';

describe('My Test Suite', () => {
  it('My Test Case', () => {
    expect(true).toEqual(true);
  });

  it('Tests with axe-core', async (done) => {
    global.django = {course_id: 12345};
    jest.setTimeout(10000);
    global.fetch = await mockFetchSuccess({
      assignments: [],
      submissions: [],
      students: [
        { id: 1, sortable_name: 'bill' },
        { id: 2, sortable_name: 'sue' },
      ],
    });
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
