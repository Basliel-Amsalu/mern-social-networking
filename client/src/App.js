import { Fragment } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Alert from "./components/layout/Alert";
function App() {
  return (
    <Router>
      <Fragment>
        <Navbar />
        <Routes>
          <Route exact path='/' element={<Landing />} />
        </Routes>

        <section className='container'>
          <Alert />
          <Routes>
            <Route exact path='/login' element={<Login />} />

            <Route exact path='/register' element={<Register />} />
          </Routes>
        </section>
      </Fragment>
    </Router>
  );
}

export default App;
