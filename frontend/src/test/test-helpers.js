import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

let wrapper;
export const mountToDoc = (reactElm) => {
  if (!document) {
    // Set up a basic DOM
    global.document = jsdom('<!doctype html><html><body></body></html>');
  }
  if (!wrapper) {
    wrapper = document.createElement('div');
    wrapper.id = 'app';
    document.body.appendChild(wrapper);
  }
  const container = mount(reactElm);
  // container.update();
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
