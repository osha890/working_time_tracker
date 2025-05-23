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
        <header>
          <div className="adminPanel">
            <h2>Projects</h2>
            <h2>Tasks</h2>
            <h2>Users</h2>
            <h2>Tracks</h2>
          </div>
        </header>
        <main>
          <ProjectList projects={this.state.projects} />
        </main>
        <footer></footer>

      </div>
    );
  }
}

export default App;
