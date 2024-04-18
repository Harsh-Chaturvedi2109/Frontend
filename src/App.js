
import './App.css';
import Login from './components/loginComponent/loginForm';
import Register from './components/registerComponent/registerForm';
import Welcome from './components/welcomeComponent/welcome';
import Home from './components/Home/Home';
import Search from './components/search/Search'
import About from './components/About/About'
import Academic from './components/Academic/Academic';
import { Route, Routes } from 'react-router-dom';
import AddCourses from './components/AddCourses/addCourses';
import SelectCourse from './components/SelectCourse/selectCourse';
import RegisteredStudents from './components/RegisteredStudents/RegisteredStudents';
import ExamRegistration from './components/Exam Registration/examRegistration';
import Admitcard from './components/Admitcard/Admitcard';
import SearchCourses from './components/searchCourses/searchCourses';
function App() {

  return (
    <div className="App">
    <Routes>
        <Route exact path='/' Component={Register}></Route>
        <Route exact path='/login' Component={Login}></Route>
        <Route exact path='/welcome' Component={Welcome}></Route>
        <Route exact path='/Home' Component={Home}></Route>
        <Route exact path='/About' Component={About}></Route>
        <Route exact path='/search' Component={Search}></Route>
        <Route exact path ='/Academic'Component={Academic}></Route>
        <Route exact path='/AddCourse' Component={AddCourses}></Route>
        <Route exact path='/SelectCourse' Component={SelectCourse}></Route>
        <Route exact path='/RegisteredStudents' Component={RegisteredStudents}></Route>
        <Route exact path='/examRegistration' Component={ExamRegistration}></Route>
        <Route exact path='/admitCard' Component={Admitcard}></Route>
        <Route exact path='/references' Component={SearchCourses}></Route>
    </Routes>
      
      
    </div>
  );
}

export default App;
