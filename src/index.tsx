import React from 'react';
import ReactDOM from 'react-dom';
import MainProvider from './libs/mainProvider';
import App from './pages/App'
import './styles/global.scss'

ReactDOM.render(
  <React.StrictMode>
    <MainProvider>
      <App />
    </MainProvider>
  </React.StrictMode>,
  document.getElementById('root')
);