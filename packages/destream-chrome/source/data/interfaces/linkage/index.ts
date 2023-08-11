/**
 * External, do not edit.
 */


// #region module
export interface DestreamLinkage {
    id: string;
    name: string;
    ownedBy: string;
    generatedAt: number;
    urls: string[];
    sessions: DestreamLinkageSession[];
}

export interface DestreamLinkageSession {
    id: string;
    name: string;
    synchronize: DestreamLinkageSynchronizeEvent[];
    starter: DestreamLinkageSessionStarterEvent[];
    beforeStart: DestreamLinkageSessionBeforeStartEvent[];
    afterStart: DestreamLinkageSessionAfterStartEvent[];
    afterEnd: DestreamLinkageSessionAfterEndEvent[];
}

export type DestreamLinkageSynchronizeEvent =
    | DestreamLinkageSynchronizeMainToSession
    | DestreamLinkageSynchronizeSessionToMain;

export type DestreamLinkageSessionStarterEvent =
    | DestreamLinkageEventAfterTimeOnPage
    | DestreamLinkageEventAtMediaTime;

export type DestreamLinkageSessionBeforeStartEvent =
    | DestreamLinkageEventPauseMediaInitialPage;

export type DestreamLinkageSessionAfterStartEvent =
    | DestreamLinkageEventFocusSessionPage
    | DestreamLinkageEventSetMediaTime;

export type DestreamLinkageSessionAfterEndEvent =
    | DestreamLinkageEventCloseSessionPage
    | DestreamLinkageEventFocusInitialPage
    | DestreamLinkageEventPlayMediaInitialPage;


export interface DestreamLinkageSynchronizeMainToSession {
    type: 'mainToSession';
}

export interface DestreamLinkageSynchronizeSessionToMain {
    type: 'sessionToMain';
}


export interface DestreamLinkageEventAfterTimeOnPage {
    type: 'afterTimeOnPage';
    data: number;
}

export interface DestreamLinkageEventAtMediaTime {
    type: 'atMediaTime';
    data: number;
}


export interface DestreamLinkageEventPauseMediaInitialPage {
    type: 'pauseMediaInitialPage';
}


export interface DestreamLinkageEventFocusSessionPage {
    type: 'focusSessionPage';
}

export interface DestreamLinkageEventSetMediaTime {
    type: 'setMediaTime';
    data: number;
}


export interface DestreamLinkageEventCloseSessionPage {
    type: 'closeSessionPage';
}

export interface DestreamLinkageEventFocusInitialPage {
    type: 'focusInitialPage';
}

export interface DestreamLinkageEventPlayMediaInitialPage {
    type: 'playMediaInitialPage';
}
// #endregion module
