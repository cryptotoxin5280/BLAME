import React from 'react';
import Header from './components/header/header.jsx';
import Tab from './components/tab.jsx';
import JobTable from './components/jobTable.jsx';

function App() {
  return (
    <div className="App">
      <Header />
      { Tab() }
    </div>
  );
}

export default App;
