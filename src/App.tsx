import React from 'react';
import './App.css';
import Call from './features/call/Call';
import { Provider } from 'react-redux';
import store from './shared/store';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="">
        <Call />
      </div>
    </Provider>
  );
}

export default App;
