import React from 'react';
import { mount } from 'enzyme';
import '../../test/setUpTests';

import CsvDownloadLink from './CsvDownloadLink';


const testData = [
  { firstname: 'Ahmed', lastname: 'Tomi', email: 'testEmail1@test.org' },
  { firstname: 'Raed', lastname: 'Labes', email: 'testEmail2@test.org' },
  { firstname: 'Yezzi', lastname: 'Min', email: 'testEmail3@test.org' },
];

describe('<CsvDownloadLink />', () => {
  it('<CsvDownloadLink /> renders link', async () => {
    const component = await mount(<CsvDownloadLink data={testData} text=".CSV Download" />);
    const link = component.find('a');
    expect(link.length).toEqual(1);
    expect(link.text()).toEqual('.CSV Download');
  });
});
