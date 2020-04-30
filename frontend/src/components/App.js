import React, { useEffect, useReducer } from 'react';
import '@instructure/canvas-theme';
import './App.css';
import { initialState, reducer } from './AppState';
import TopNav from './TopNav/TopNav';
import { Button } from '@instructure/ui-buttons/lib/Button';

export const AppContext = React.createContext(null);

const App = () => {

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect( () => {
    fetch('data/some_data')
      .then((response) => {
        if (response.status > 400) {
          return dispatch({ type: 'receivePayloadError' })
        }
        return response.json();
      })
      .then((payload) => {
        dispatch({ type: 'receivePayload', value: payload });
      });
  }, []);

  return (
    <div>
    <AppContext.Provider value={{state: state, dispatch: dispatch}}>
      <TopNav />
    </AppContext.Provider>
    </div>
  );
};

export default App;
