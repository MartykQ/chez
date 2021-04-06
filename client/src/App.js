import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Route} from 'react-router-dom';

import Join from './components/Join/Join';
import Meeting from './components/Meeting/Meeting';



const App = () => {
  return (
    <Router>
      <Route path="/" exact component={Join}/>
      <Route path="/meet" exact component={Meeting}/>
    </Router>
  );
}

export default App;
