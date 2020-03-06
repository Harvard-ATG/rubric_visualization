import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
//import './App.css';

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

  const studentList = appState.loaded
    ? (
      <ul>
        {appState.data.students.map((student) => (
          <li key={student.id}>
            {student.sortable_name}
          </li>
        ))}
      </ul>
    )
    : <p>{appState.placeholder}</p>;

  return (
    <div>
      <p>Here is the react app.</p>
      <p>
        And Here is the value from the django template
        {window.django.randomValue}
      </p>
      {studentList}
    </div>
  );
};

export default App;

const container = document.getElementById('app');
render(<App />, container);
