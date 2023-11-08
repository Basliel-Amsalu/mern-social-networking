import { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Alert from "./components/layout/Alert";
import setAuthToken from "./utils/setAuthToken";
import { loadUser } from "./actions/auth";
import store from "./store";
import Dashboard from "./components/dashboard/Dashboard";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}
function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
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
            <Route exact path='/dashboard' element={<Dashboard />} />
          </Routes>
        </section>
      </Fragment>
    </Router>
  );
}

export default App;
