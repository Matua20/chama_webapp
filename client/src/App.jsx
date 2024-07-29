import React, { useState } from 'react';
import Registration from './components/Registration';
import Dashboard from './components/Dashboard';
import './App.css';

const App = () => {
  const [userId, setUserId] = useState(null);

  return (
    <div className="app">
      {!userId ? (
        <Registration onRegister={setUserId} />
      ) : (
        <Dashboard userId={userId} />
      )}
    </div>
  );
};

export default App;
