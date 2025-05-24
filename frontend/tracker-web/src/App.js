import React, { Component } from 'react';
import './App.css';
import ProjectList from './components/project-list';
import TaskList from './components/task-list';
import UserList from './components/user-list';
import TrackList from './components/track-list';

class App extends Component {
  state = {
    projects: [],
    tasks: [],
    users: [],
    tracks: [],
    activeSection: 'Projects',
  }

  componentDidMount() {
    fetch("http://127.0.0.1:8000/api/projects/")
      .then(resp => resp.json())
      .then(data => this.setState({ projects: data }))
      .catch(error => console.log(error));
  }

  handleSectionChange = (section) => {
    this.setState({ activeSection: section });

    if (section === 'Projects' && this.state.projects.kength === 0) {
      fetch("http://127.0.0.1:8000/api/projects/")
        .then(resp => resp.json())
        .then(data => this.setState({ projects: data }))
        .catch(error => console.log(error));
    }

    if (section === 'Tasks' && this.state.tasks.length === 0) {
      fetch("http://127.0.0.1:8000/api/tasks/")
        .then(resp => resp.json())
        .then(data => this.setState({ tasks: data }))
        .catch(error => console.log(error));
    }

    if (section === 'Users' && this.state.users.length === 0) {
      fetch("http://127.0.0.1:8000/api/users/")
        .then(resp => resp.json())
        .then(data => this.setState({ users: data }))
        .catch(error => console.log(error));
    }

    if (section === 'Tracks' && this.state.tracks.length === 0) {
      fetch("http://127.0.0.1:8000/api/tracks/")
        .then(resp => resp.json())
        .then(data => this.setState({ tracks: data }))
        .catch(error => console.log(error));
    }
  }

  renderSection() {
    const { activeSection, projects, tasks, users, tracks } = this.state;

    switch (activeSection) {
      case 'Projects':
        return <ProjectList projects={projects} />;
      case 'Tasks':
        return <TaskList tasks={tasks} />;
      case 'Users':
        return <UserList users={users} />;
      case 'Tracks':
        return <TrackList tracks={tracks} />;
      default:
        return <p>Section not found</p>;
    }
  }

  render() {
    return (
      <div className="App">
        <header>
          <div className="adminPanel">
            <h2 onClick={() => this.handleSectionChange('Projects')}>Projects</h2>
            <h2 onClick={() => this.handleSectionChange('Tasks')}>Tasks</h2>
            <h2 onClick={() => this.handleSectionChange('Users')}>Users</h2>
            <h2 onClick={() => this.handleSectionChange('Tracks')}>Tracks</h2>
          </div>
        </header>
        <main>
          {this.renderSection()}
        </main>
        <footer></footer>
      </div>
    );
  }
}

export default App;