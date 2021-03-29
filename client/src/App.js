import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { useState } from 'react';

import Navbar from './components/Navbar'
import Home from './pages/Home';
import Authentication from './pages/Authentication';

function App() {

  const [loggedIn, setLoggedin] = useState(false)
  const [company, setCompany] = useState('')


  return (
    <Router>
      <Navbar companyName={company.name} loggedIn={loggedIn} />
      <div className="page-content">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/register" render={() => <Authentication login={false} company={company} />} />
          <Route exact path="/login" render={() => <Authentication login={true} />} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
