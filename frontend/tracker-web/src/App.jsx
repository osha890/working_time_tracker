import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Users from './pages/Users';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import ProjectTasks from './pages/ProjectTasks';
import MyTasks from './pages/MyTasks';
import Tracks from './pages/Tracks';
import { UserProvider } from './UserContext';


function AppWrapper() {
  const location = useLocation();

  const hideHeader = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/project_tasks"
          element={
            <PrivateRoute>
              <ProjectTasks />
            </PrivateRoute>
          }
        />
        <Route
          path="/my_tasks"
          element={
            <PrivateRoute>
              <MyTasks />
            </PrivateRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <PrivateRoute adminOnly={true}>
              <Projects />
            </PrivateRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <PrivateRoute adminOnly={true}>
              <Tasks />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute adminOnly={true}>
              <Users />
            </PrivateRoute>
          }
        />
        <Route
          path="/tracks"
          element={
            <PrivateRoute adminOnly={true}>
              <Tracks />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AppWrapper />
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
