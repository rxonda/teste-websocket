import React from 'react';

import './styles.css';

import Header from './components/Header';
import Executions from './pages/execution';

const App = () => (
  <div className="App">
    <Header />
    <Executions />
  </div>
);

export default App;
