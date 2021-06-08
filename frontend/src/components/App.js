import React, { useEffect, useReducer } from 'react';

import { businessDataFetched, businessDataFetchErrored } from './eventTypes';

import './App.css';
import { initialState, reducer, AppContext } from './AppState';

import CompareAssignmentsTab from './CompareAssignmentsTab/CompareAssignmentsTab';
import ErrorCard from './ErrorCard/ErrorCard';

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetch(`data/${window.django.course_id}`)
      .then((response) => {
        if (response.status >= 400) {
          return Promise.reject(response.statusText);
        }
        return response.json();
      })
      .then((data) => dispatch({ type: businessDataFetched, value: data }))
      .catch((err) => dispatch({ type: businessDataFetchErrored, value: err }));
  }, []);

  const app = !state.processing.error ? <CompareAssignmentsTab /> : <ErrorCard />;

  return (
    <div>
      <AppContext.Provider value={{ state, dispatch }}>
        {app}
      </AppContext.Provider>
    </div>
  );
};

export default App;
