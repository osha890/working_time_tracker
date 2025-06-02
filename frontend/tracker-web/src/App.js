import React, { Component } from 'react';
import 'style/App.css';
import ProjectList from 'components/project-list';
import TaskList from 'components/task-list';
import UserList from 'components/user-list';
import TrackList from 'components/track-list';

class App extends Component {
  BASE_URL = process.env.REACT_APP_API_BASE_URL;

  state = {
    projects: [],
    tasks: [],
    users: [],
    tracks: [],
    currentSection: 'Projects',
  }

  componentDidMount() {
    fetch(`${this.BASE_URL}/api/projects/`)
      .then(resp => resp.json())
      .then(data => this.setState({ projects: data }))
      .catch(error => console.log(error));
  }

  handleSectionChange = (section) => {
    this.setState({ currentSection: section });

    if (section === 'Projects' && this.state.projects.length === 0) {
      fetch(`${this.BASE_URL}/api/projects/`)
        .then(resp => resp.json())
        .then(data => this.setState({ projects: data }))
        .catch(error => console.log(error));
    }

    if (section === 'Tasks' && this.state.tasks.length === 0) {
      fetch(`${this.BASE_URL}/api/tasks/`)
        .then(resp => resp.json())
        .then(data => this.setState({ tasks: data }))
        .catch(error => console.log(error));
    }

    if (section === 'Users' && this.state.users.length === 0) {
      fetch(`${this.BASE_URL}/api/users/`)
        .then(resp => resp.json())
        .then(data => this.setState({ users: data }))
        .catch(error => console.log(error));
    }

    if (section === 'Tracks' && this.state.tracks.length === 0) {
      fetch(`${this.BASE_URL}/api/tracks/`)
        .then(resp => resp.json())
        .then(data => this.setState({ tracks: data }))
        .catch(error => console.log(error));
    }
  }

  renderSection() {
    const { currentSection, projects, tasks, users, tracks } = this.state;

    switch (currentSection) {
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
            <div className={this.state.currentSection === 'Projects' ? 'menuItem active' : 'menuItem'} onClick={() => this.handleSectionChange('Projects')}>Projects</div>
            <div className={this.state.currentSection === 'Tasks' ? 'menuItem active' : 'menuItem'} onClick={() => this.handleSectionChange('Tasks')}>Tasks</div>
            <div className={this.state.currentSection === 'Users' ? 'menuItem active' : 'menuItem'} onClick={() => this.handleSectionChange('Users')}>Users</div>
            <div className={this.state.currentSection === 'Tracks' ? 'menuItem active' : 'menuItem'} onClick={() => this.handleSectionChange('Tracks')}>Tracks</div>
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