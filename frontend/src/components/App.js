import React, { Component } from "react";
import { render } from "react-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loaded: false,
      placeholder: "Loading"
    };
  }


  render() {
    return (
      <div>
        <p>Here is the react app.</p>
        <p>And Here is the value from the django template {window.django.randomValue}</p>
      </div>
    );
  }
}

export default App;

const container = document.getElementById("app");
render(<App />, container);
