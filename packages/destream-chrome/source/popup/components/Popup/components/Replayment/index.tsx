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
        Replayment as IReplayment,
        ResponseMessage,
        MessageReplaymentIndex,
        MessageReplaymentPlay,
        MessageReplaymentPause,
        MessageReplaymentStop,

        MESSAGE_POPUP_TO_BACKGROUND,
    } from '~data/index';

    import {
        sendMessage,
    } from '~common/messaging';

    import {
        storageAddListener,
        storageRemoveListener,
    } from '~common/storage';

    import {
        Tab,
    } from '~common/types';

    import {
        getReplaymentByTabID,
        replaymentAtEnd,
    } from '~background/replayments';

    import {
        buttonStyle,
    } from '../../styled';
    // #endregion external
// #region imports



// #region module
export interface ReplaymentProperties {
    activeTab: Tab | null;
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

        await sendMessage<MessageReplaymentStop, ResponseMessage>(
            {
                type: MESSAGE_POPUP_TO_BACKGROUND.REPLAYMENT_STOP,
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

        await sendMessage<MessageReplaymentIndex, ResponseMessage>(
            {
                type: MESSAGE_POPUP_TO_BACKGROUND.REPLAYMENT_INDEX,
                data: {
                    tabID: activeTab.id,
                    index,
                    updateTab: true,
                },
            },
            () => {
                sendMessage<MessageReplaymentPause, ResponseMessage>(
                    {
                        type: MESSAGE_POPUP_TO_BACKGROUND.REPLAYMENT_PAUSE,
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
            ? MESSAGE_POPUP_TO_BACKGROUND.REPLAYMENT_PAUSE
            : MESSAGE_POPUP_TO_BACKGROUND.REPLAYMENT_PLAY;

        await sendMessage<MessageReplaymentPlay | MessageReplaymentPause, ResponseMessage>(
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

        storageAddListener(storageLogic);

        return () => {
            storageRemoveListener(storageLogic);
        }
    }, [
        replayment,
        activeTab,
    ]);
    // #endregion effects


    // #region render
    const playPauseText = replayment.status === 'playing'
        ? 'Pause'
        : replaymentAtEnd(replayment)
            ? 'Replay'
            : 'Play';
    const durationText = replayment.duration < (60 * 1_000)
        ? (replayment.duration / 1_000).toFixed(2) + ' seconds'
        : (replayment.duration / (60 * 1_000)).toFixed(2) + ' minutes';

    return (
        <>
            <h1>
                replaying destream
            </h1>

            <PureButton
                text={playPauseText}
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

            {replayment.duration && (
                <div>
                    {durationText}
                </div>
            )}

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
