import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Connect4 from './Game';
import LoginForm from './Login';
import registerServiceWorker from './registerServiceWorker';
import './index.css';


const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={LoginForm}/>
      <Route path='/play' component={Connect4}/>
    </Switch>
  </main>
)

const App = () => (
  <div>
    <Main/>
  </div>
)

ReactDOM.render((
  <BrowserRouter>
    <App/>
  </BrowserRouter>
), document.getElementById('root'));
registerServiceWorker();
