import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { store } from './redux/store';

import AuthSystem from './components/auth/AuthSystem'; 
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<AuthSystem />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;