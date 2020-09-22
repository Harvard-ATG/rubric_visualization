import React, { useEffect, useReducer } from 'react';

import './App.css';
import { newState, newReducer, AppContext } from './AppState';
import TopNav from './TopNav/TopNav';

const App = () => {
  const [state, dispatch] = useReducer(newReducer, newState);

  useEffect(() => {
    fetch(`data/${window.django.course_id}`)
      .then((response) => {
        if (response.status >= 400) {
          return dispatch({ type: 'businessDataFetchErrored', value: 'The canvas api fetch failed.' });
        }
        return response.json();
      })
      .then((payload) => {
        dispatch({ type: 'businessDataFetched', value: payload });
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
