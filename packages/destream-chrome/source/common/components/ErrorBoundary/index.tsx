// #region imports
    // #region libraries
    import React from 'react';
    // #endregion libraries


    // #region external
    import {
        log,
    } from '~common/utilities';
    // #endregion external
// #region imports



// #region module
export interface ErrorBoundaryProperties {
    fallback: React.ReactNode;
    children: React.ReactNode;
}

export interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProperties, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProperties) {
        super(props);
        this.state = {
            hasError: false,
        };
    }

    static getDerivedStateFromError(_error: any) {
        return {
            hasError: true,
        };
    }

    componentDidCatch(error: any, info: any) {
        log(error, info);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }

        return this.props.children;
    }
}
// #endregion module



// #region exports
export default ErrorBoundary;
// #endregion exports
