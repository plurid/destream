// #region imports
    // #region libraries
    import styled from 'styled-components';
    // #endregion libraries
// #endregion imports



// #region module
export const StyledPopup = styled.div`
    h1 {
        font-size: 14px;
        font-weight: 400;
        margin-bottom: 2rem;
    }

    a {
        color: white;
        text-decoration: none;
    }

    display: grid;
    place-content: center;
    padding: 2rem;
    grid-gap: 1rem;
`;


export const StyledTabControl = styled.div`
    min-height: 100px;
    display: grid;
    place-content: center;
    justify-items: center;
    word-break: break-all;
    line-height: 1.5rem;
`;


export const StyledURLText = styled.div`
    margin: 0 1rem;
`;

export const StyledURL = styled.div`
    user-select: all;
`;


export const buttonStyle = {
    marginTop: '1rem',
    width: '280px',
};
// #endregion module
