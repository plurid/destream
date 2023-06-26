// #region imports
    // #region libraries
    import React from 'react';
    // #endregion libraries


    // #region external
    import ErrorBoundary from '~common/components/ErrorBoundary';
    import ErrorFallback from '~common/components/ErrorFallback';
    // #endregion external


    // #region internal
    import Popup from './components/Popup';
    // #endregion internal
// #endregion imports



// #region module
const App = () => {
    return (
        <ErrorBoundary
            fallback={<ErrorFallback />}
        >
            <Popup />
        </ErrorBoundary>
    );
}
// #endregion module



// #region exports
export default App;
// #endregion exports
