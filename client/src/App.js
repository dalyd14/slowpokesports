import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { useState } from 'react';

import Auth from './utils/auth'

import Navbar from './components/Navbar'
import Home from './pages/Home';
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
          <Route exact path="/register" render={() => <Authentication login={false} setUser={setUser} setLoggedin={setLoggedin} />} />
          <Route exact path="/login" render={() => <Authentication login={true} setUser={setUser} setLoggedin={setLoggedin} />} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
