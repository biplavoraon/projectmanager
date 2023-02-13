import { Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import "react-datepicker/dist/react-datepicker.css"; 

import Home from './components/Home';
import NewTask from './components/NewTask';
import Layout from './components/Layout';
import TaskPage from './components/TaskPage';
import Missing from './components/Missing';
import Register from './components/Register';
import Login from './components/Login';
import TaskList from './components/TaskList';
import EditTask from './components/EditTask';
import PersistLogin from './components/PersistLogin';
import Unauthorized from './components/Unauthorized';
import RequireAuth from './components/RequireAuth';
import Board from './components/Board';

function App() {
  return (
    <DataProvider>

        <Routes>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />

          <Route path="/" element={<Layout />} >
              <Route path="*" element={<Missing />} />
              <Route path="unauthorized" element={<Unauthorized />} />
            
            <Route element={<PersistLogin />} >
              <Route element={<RequireAuth allowedRoles={['ROLE_USER', 'ROLE_ADMIN']} />}>
                <Route index element={<Home />} />

                <Route path="task">
                  <Route index element={<TaskList />} />
                  <Route path=":taskid" element={<TaskPage />} />
                </Route>

                  <Route path="board" element={<Board />} />

              </Route>
              
              <Route element={<RequireAuth allowedRoles={['ROLE_ADMIN']} />}>
                <Route path="addtask" element={<NewTask />} />

                <Route path="edit/:taskid" element={<EditTask />} />
              </Route>
            </Route>

          </Route>
        </Routes>
    </DataProvider>
  );
}

export default App;
