// #region imports
    // #region libraries
    import React from 'react';
    // #endregion libraries


    // #region external
    import ErrorBoundary from '~common/components/ErrorBoundary';
    import ErrorFallback from '~common/components/ErrorFallback';
    // #endregion external


    // #region internal
    import Options from './components/Options';
    // #endregion internal
// #endregion imports



// #region module
const App = () => {
    return (
        <ErrorBoundary
            fallback={<ErrorFallback />}
        >
            <Options />
        </ErrorBoundary>
    );
}
// #endregion module



// #region exports
export default App;
// #endregion exports
