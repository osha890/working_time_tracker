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
import ProjectDetail from './pages/ProjectDetail';
import MyTasks from './pages/MyTasks';
import Tracks from './pages/Tracks';
import { UserProvider } from './UserContext';
import Reports from './pages/Reports';
import TaskDetail from './pages/TaskDetail';

const routes = [
  { path: '/login', element: <Login />, private: false },
  { path: '/register', element: <Register />, private: false },

  { path: '/', element: <Home />, private: true },
  { path: '/project', element: <ProjectDetail />, private: true },
  { path: '/my_tasks', element: <MyTasks />, private: true },
  { path: '/tasks/:taskId', element: <TaskDetail />, private: true },
  { path: '/reports', element: <Reports />, private: true },

  { path: '/projects', element: <Projects />, private: true, adminOnly: true },
  { path: '/projects/:projectId', element: <ProjectDetail />, private: true, adminOnly: true },
  { path: '/tasks', element: <Tasks />, private: true, adminOnly: true },
  { path: '/users', element: <Users />, private: true, adminOnly: true },
  { path: '/tracks', element: <Tracks />, private: true, adminOnly: true },
];

function AppWrapper() {
  const location = useLocation();
  const hideHeader = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        {routes.map(({ path, element, private: isPrivate, adminOnly }, idx) =>
          isPrivate ? (
            <Route
              key={idx}
              path={path}
              element={<PrivateRoute adminOnly={adminOnly}>{element}</PrivateRoute>}
            />
          ) : (
            <Route key={idx} path={path} element={element} />
          )
        )}
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
