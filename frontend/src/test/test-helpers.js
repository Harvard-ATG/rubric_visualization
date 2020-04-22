import { configure, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

let wrapper;
export const mountToDoc = async (reactElm) => {
  if (!document) {
    // Set up a basic DOM
    global.document = jsdom('<!doctype html><html><body></body></html>');
  }
  if (!wrapper) {
    wrapper = document.createElement('div');
    wrapper.id = 'app';
    document.body.appendChild(wrapper);
  }
  let container;
  await act(async () => {
    container = mount(reactElm);
  });
  container.setProps();
  wrapper.innerHTML = '';
  wrapper.appendChild(container.getDOMNode());
  return container;
};

export const mockFetchSuccess = (data) => {
  const mockJsonPromise = Promise.resolve(data);
  const mockFetchPromise = Promise.resolve({
    json: () => mockJsonPromise,
  });
  return jest.fn().mockImplementation(() => mockFetchPromise);
};
