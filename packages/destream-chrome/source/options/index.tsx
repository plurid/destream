// #region imports
    // #region libraries
    import React from 'react';

    import {
        createRoot,
    } from 'react-dom/client';
    // #endregion libraries


    // #region internal
    import App from './App';
    // #endregion internal
// #endregion imports



// #region module
const application = document.getElementById('root')!;

createRoot(application).render(<App />);
// #endregion module
