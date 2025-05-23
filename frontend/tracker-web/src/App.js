import React, { Component } from 'react';
import './App.css';
import ProjectList from './components/project-list';

class App extends Component {
  state = {
    projects: []
  }

  componentDidMount() {
    fetch("http://127.0.0.1:8000/api/projects/", {
      method: "GET"
    }).then(resp => resp.json())
      .then(data => this.setState({ projects: data }))
      .catch(error => console.log(error));
  }

  render() {
    return (
      <div className="App">
        <h1>Working Time Tracker</h1>
        <ProjectList projects={this.state.projects} />
      </div>
    );
  }
}

export default App;
