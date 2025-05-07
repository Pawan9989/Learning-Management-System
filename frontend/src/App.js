import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/login';
import Register from './Components/register';
import Course from './Components/course';
import Courses from './Components/Courses';
import Profile from './Components/profile';
import Learnings from './Components/learnings';
import Home from './Components/Home';
import AddCourse from './Components/AddCourse';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './Components/DashBoard/Dashboard';
import 'boxicons/css/boxicons.min.css';
import EditCourse from './Components/EditCourses';
import DUsers from './Components/DashBoard/DUsers';
import DCourses from './Components/DashBoard/DCourses';
import Assessment from './Components/Assessment';
import ErrorPage from './Components/ErrorPage';
import AddQuestions from './Components/AddQuestions';
import Performance from './Components/DashBoard/Performance';
import DTutors from './Components/DashBoard/DTutors';
import certificate from './Components/certificate';
import Forum from './Components/forum';
import ProtectedRoute from "./Components/ProtectedRoute";
import AdminRoute from "./Components/AdminRoute";
import PersonalDashboard from "./Components/PersonalDashboard";
import SetGoal from "./Components/SetGoal";
import CareerPaths from "./Components/CareerPaths";
import CareerPathDetails from "./Components/CareerPathDetails";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/addquestions/:id" element={<AddQuestions />} />
          <Route path='/dashboard' element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          } />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/' element={<Home />} />
          <Route path='/courses' element={<Courses />} />
          <Route path='/course/:id' element={<Course />} />
          <Route path='/discussion/:id' element={<Forum />} />
          <Route path='/certificate/:id' element={<certificate />} />
          <Route path='/assessment/:id' element={<Assessment />} />
          <Route path='/addcourse' element={
            <AdminRoute>
              <AddCourse />
            </AdminRoute>
          } />
          <Route path='/editCourse/:id' element={
            <AdminRoute>
              <EditCourse />
            </AdminRoute>
          } />
          <Route path='/profile' element={<Profile />} />
          <Route path='/Learnings' element={<Learnings />} />
          <Route path='/Dcourses' element={
            <AdminRoute>
              <DCourses />
            </AdminRoute>
          } />
          <Route path='/Dusers' element={
            <AdminRoute>
              <DUsers />
            </AdminRoute>
          } />
          <Route path='/Dtutors' element={
            <AdminRoute>
              <DTutors />
            </AdminRoute>
          } />
          <Route path='/Performance' element={
            <AdminRoute>
              <Performance />
            </AdminRoute>
          } />
          <Route path='*' element={<ErrorPage />} />
          <Route path="/dashboard" element={<PersonalDashboard />} />
        <Route path="/set-goal" element={<SetGoal />} />
        <Route path='/dashboard' element={
  <AdminRoute>
    <Dashboard />
  </AdminRoute>
} />
<Route path="/my-dashboard" element={<PersonalDashboard />} />
<Route path="/career-paths" element={<CareerPaths />} />
          <Route path="/career-paths/:path" element={<CareerPathDetails />} />
        </Routes>
        
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;