// #region imports
    // #region libraries
    import styled from 'styled-components';

    import {
        Theme,
    } from '@plurid/plurid-themes';
    // #region libraries
// #region imports



// #region module
export interface IStyledDrawer {
    theme: Theme;
}

export const StyledDrawer = styled.div<IStyledDrawer>`
    h1 {
        font-size: 14px;
        font-weight: 400;
        margin-bottom: 2rem;
        padding-bottom: 10px;
        text-align: center;
        border-bottom: 1px solid transparent;
        cursor: pointer;
        user-select: none;
    }

    h1:hover {
        border-bottom: 1px solid white;
    }
`;
// #region module
