// #region imports
    // #region libraries
    import React, {
        useEffect,
    } from 'react';

    import {
        plurid,
    } from '@plurid/plurid-themes';

    import {
        PureButton,
        LinkButton,
        Slider,
    } from '@plurid/plurid-ui-components-react';
    // #endregion libraries


    // #region external
    import {
        MESSAGE_TYPE,

        Replayment as IReplayment,
        ReplaymentIndexMessage,
        ReplaymentPlayMessage,
        ReplaymentPauseMessage,
        ReplaymentStopMessage,
    } from '../../../../../data';

    import {
        sendMessage,
    } from '../../../../../common/messaging';

    import {
        getReplaymentByTabID,
        replaymentAtEnd,
    } from '../../../../../background/replayments';

    import {
        buttonStyle,
    } from '../../styled';
    // #endregion external
// #region imports



// #region module
export interface ReplaymentProperties {
    activeTab: chrome.tabs.Tab | null;
    replayment: IReplayment | null;
    setReplayment: React.Dispatch<React.SetStateAction<IReplayment>>;
}

const Replayment: React.FC<ReplaymentProperties> = (
    properties,
) => {
    // #region properties
    const {
        activeTab,
        replayment,
        setReplayment,
    } = properties;
    // #endregion properties


    // #region handlers
    const stopReplayment = async () => {
        if (!replayment || !activeTab) {
            return;
        }

        setReplayment(null);

        await sendMessage<ReplaymentStopMessage>(
            {
                type: MESSAGE_TYPE.REPLAYMENT_STOP,
                data: activeTab.id,
            },
            () => {
            },
        );
    }

    const handleReplaymentIndex = async (
        index: number,
    ) => {
        if (!replayment || !activeTab) {
            return;
        }

        await sendMessage<ReplaymentIndexMessage>(
            {
                type: MESSAGE_TYPE.REPLAYMENT_INDEX,
                data: {
                    tabID: activeTab.id,
                    index,
                    updateTab: true,
                },
            },
            () => {
                sendMessage<ReplaymentPauseMessage>(
                    {
                        type: MESSAGE_TYPE.REPLAYMENT_PAUSE,
                        data: activeTab.id,
                    },
                    () => {
                    },
                );
            },
        );
    }

    const handleReplaymentPlayPause = async () => {
        if (!replayment || !activeTab) {
            return;
        }

        const messageType = replayment.status === 'playing'
            ? MESSAGE_TYPE.REPLAYMENT_PAUSE
            : MESSAGE_TYPE.REPLAYMENT_PLAY;

        await sendMessage<ReplaymentPlayMessage | ReplaymentPauseMessage>(
            {
                type: messageType,
                data: activeTab.id,
            },
            () => {
            },
        );
    }
    // #endregion handlers


    // #region effects
    useEffect(() => {
        if (!replayment || !activeTab) {
            return;
        }

        const storageLogic = async () => {
            const replayment = await getReplaymentByTabID(activeTab.id);
            if (!replayment) {
                return;
            }

            setReplayment(replayment);
        }

        chrome.storage.onChanged.addListener(storageLogic);

        return () => {
            chrome.storage.onChanged.removeListener(storageLogic);
        }
    }, [
        replayment,
        activeTab,
    ]);
    // #endregion effects


    // #region render
    return (
        <>
            <h1>
                replaying destream
            </h1>

            <PureButton
                text={
                    replayment.status === 'playing'
                        ? 'Pause'
                        : replaymentAtEnd(replayment) ? 'Replay' : 'Play'
                }
                atClick={() => {
                    handleReplaymentPlayPause();
                }}
                theme={plurid}
                level={2}
                style={buttonStyle}
            />

            <div
                style={{
                    margin: '2rem 0',
                }}
            >
                <Slider
                    value={replayment.currentIndex}
                    atChange={(
                        index,
                    ) => {
                        handleReplaymentIndex(index);
                    }}
                    min={0}
                    max={replayment.data.events.length - 1}
                    step={1}
                    theme={plurid}
                    width={280}
                    level={2}
                />
            </div>

            <div>
                <LinkButton
                    text="cancel"
                    atClick={() => {
                        stopReplayment();
                    }}
                    theme={plurid}
                    style={{
                        margin: '1rem 0',
                    }}
                    inline={true}
                />
            </div>
        </>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Replayment;
// #endregion exports
