import React from 'react';
import { createRoot } from 'react-dom';
import App from './App';
import "./styles/index.scss";

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Commentez ou supprimez cette ligne si vous ne mesurez pas les performances pour le moment
// reportWebVitals();


