import React, { useEffect, useReducer } from 'react';
import '@instructure/canvas-theme';
import './App.css';
import { initialState, reducer, AppContext } from './AppState';
import TopNav from './TopNav/TopNav';

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetch('data/some_data')
      .then((response) => {
        if (response.status > 400) {
          return dispatch({ type: 'receivePayloadError' });
        }
        return response.json();
      })
      .then((payload) => {
        dispatch({ type: 'receivePayload', value: payload });
      });
  }, []);

  return (
    <div>
      <AppContext.Provider value={{ state, dispatch }}>
        <TopNav />
      </AppContext.Provider>
    </div>
  );
};

export default App;
