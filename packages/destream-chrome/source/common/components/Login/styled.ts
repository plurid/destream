// #region imports
    // #region libraries
    import styled from 'styled-components';

    import {
        Theme,
    } from '@plurid/plurid-themes';
    // #region libraries
// #region imports



// #region module
export interface IStyledLogin {
    theme: Theme;
}

export const StyledLogin = styled.div<IStyledLogin>`
    display: grid;
    gap: 1.5rem;
    place-content: center;
    justify-items: center;
    min-height: 280px;
`;
// #region module
