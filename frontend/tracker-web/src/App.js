import React, { useState, useEffect } from 'react';
import 'style/App.css';
import ProjectList from 'components/project-list';
import TaskList from 'components/task-list';
import UserList from 'components/user-list';
import TrackList from 'components/track-list';
import LoginForm from 'components/login-form';
import { fetchWithAuth, clearTokens, getAccessToken, getRefreshToken } from './utils/auth';

const App = () => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [currentSection, setCurrentSection] = useState('Projects');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchData = (endpoint, setter) => {
    fetchWithAuth(`${BASE_URL}/api/${endpoint}/`)
      .then(resp => {
        if (!resp.ok) throw new Error('Error fetching data');
        return resp.json();
      })
      .then(data => setter(data))
      .catch(error => {
        console.error(error);
        handleLogout();
      });
  };

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      setIsAuthenticated(true);
      fetchData('projects', setProjects);
    }
  }, []);

  const handleSectionChange = (section) => {
    setCurrentSection(section);

    const sectionMap = {
      Projects: { data: projects, setter: setProjects },
      Tasks: { data: tasks, setter: setTasks },
      Users: { data: users, setter: setUsers },
      Tracks: { data: tracks, setter: setTracks },
    };

    const { data, setter } = sectionMap[section];

    if (data.length === 0) {
      fetchData(section.toLowerCase(), setter);
    }
  };

  const renderSection = () => {
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
  };

  const handleLogout = async () => {
    try {
      const refreshToken = getRefreshToken();

      if (refreshToken) {
        const response = await fetch(`${BASE_URL}/auth/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`,
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!response.ok) {
          console.warn('Logout request failed');
        }
      }

      clearTokens();
      setIsAuthenticated(false);
      setProjects([]);
      setTasks([]);
      setUsers([]);
      setTracks([]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="App">
      <header>
        <div className="adminPanel">
          <div className={currentSection === 'Projects' ? 'menuItem active' : 'menuItem'} onClick={() => handleSectionChange('Projects')}>Projects</div>
          <div className={currentSection === 'Tasks' ? 'menuItem active' : 'menuItem'} onClick={() => handleSectionChange('Tasks')}>Tasks</div>
          <div className={currentSection === 'Users' ? 'menuItem active' : 'menuItem'} onClick={() => handleSectionChange('Users')}>Users</div>
          <div className={currentSection === 'Tracks' ? 'menuItem active' : 'menuItem'} onClick={() => handleSectionChange('Tracks')}>Tracks</div>
          <div className="logOut" onClick={handleLogout}>Log out</div>
        </div>
      </header>
      <main>
        {renderSection()}
      </main>
      <footer></footer>
    </div>
  );
};

export default App;
