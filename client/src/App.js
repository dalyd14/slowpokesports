import './App.css';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import { useState } from 'react';

import Auth from './utils/auth';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Edit from './pages/Edit';
import Authentication from './pages/Authentication';

function App() {
  const isLoggedin = Auth.loggedIn()
  const [loggedin, setLoggedin] = useState(isLoggedin)
  const [user, setUser] = useState(isLoggedin ? Auth.getProfile().data : null)
  
  console.log(loggedin, user)

  return (
    <Router>
      <Navbar companyName={user?.company.display_name} loggedIn={loggedin} />
      <div className="page-content">
        <Switch>
          <Route exact path="/" render={() => <Home companyName={user?.company.display_name} />} />
          <Route exact path="/dashboard">
            {loggedin ? <Dashboard /> : <Redirect to="/login" />}
          </Route>
          <Route exact path="/products">
            {loggedin ? <Products /> : <Redirect to="/login" />}
          </Route>
          <Route exact path="/edit">
            {loggedin ? <Edit /> : <Redirect to="/login" />}
          </Route>
          <Route exact path="/register">
            {loggedin ? <Redirect to="/" /> : <Authentication login={false} setUser={setUser} setLoggedin={setLoggedin} />}
          </Route>
          <Route exact path="/login">
            {loggedin ? <Redirect to="/" /> : <Authentication login={true} setUser={setUser} setLoggedin={setLoggedin} />}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
