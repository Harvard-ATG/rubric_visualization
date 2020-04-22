import React, { useEffect, useState } from 'react';
import '@instructure/canvas-theme';
import './App.css';
import TopNav from './TopNav/TopNav';

const App = () => {
  const [appState, setAppState] = useState({
    data: { assignments: [], submissions: [], students: [] },
    loaded: false,
    placeholder: 'Loading',
  });

  useEffect(() => {
    fetch('data/some_data')
      .then((response) => {
        if (response.status > 400) {
          return setAppState({ ...appState, placeholder: 'Something went wrong!' });
        }
        return response.json();
      })
      .then((data) => setAppState({ ...appState, data, loaded: true }));
  }, []);

  return (
    <div>
      <TopNav />
    </div>
  );
};

export default App;
