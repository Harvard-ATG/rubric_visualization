import React, { Component } from "react";
import { render } from "react-dom";
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {'assignments': [], 'submissions': [], 'students': []},
      loaded: false,
      placeholder: "Loading"
    };
  }
  
  componentDidMount() {
    fetch("data/some_data")
      .then(response => {
        if (response.status > 400) {
          return this.setState(() => {
            return { placeholder: "Something went wrong!" };
          });
        }
        return response.json();
      })
      .then(data => {
        this.setState(() => {
          return {
            data,
            loaded: true
          };
        });
      });
  }

  render() {
    let studentList = (this.state.loaded ?
      <ul>
        {this.state.data.students.map(student => {
          return (
            <li key={student.id}>
              {student.sortable_name}
            </li>
          );
        })}
      </ul> :
      <p>{this.state.placeholder}</p>);
    
    return (
      <div>
        <p>Here is the react app.</p>
        <p>And Here is the value from the django template {window.django.randomValue}</p>
        {studentList}
      </div>
    );
  }
}

export default App;

const container = document.getElementById("app");
render(<App />, container);
