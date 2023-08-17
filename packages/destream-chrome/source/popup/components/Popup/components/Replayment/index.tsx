// #region imports
    // #region libraries
    import React, {
        useState,
        useEffect,
    } from 'react';

    import {
        plurid,
    } from '@plurid/plurid-themes';

    import {
        CopyableLine,
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
        destreamIDGetDisplay,
    } from '~common/utilities';

    import {
        buttonStyle,
    } from '../../styled';
    // #endregion external


    // #region internal
    import {
        StyledEvents,
        StyledEventsText,
        StyledEvent,
        StyledEventHeader,
    } from './styled';
    // #endregion internal
// #region imports



// #region module
export interface ReplaymentProperties {
    activeTab: Tab | null;
    replayment: IReplayment;
    setReplayment: React.Dispatch<React.SetStateAction<IReplayment | null>>;
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


    // #region state
    const [
        showEvents,
        setShowEvents,
    ] = useState(false);
    // #endregion state


    // #region handlers
    const stopReplayment = async () => {
        if (!replayment || !activeTab) {
            return;
        }

        setReplayment(null);

        await sendMessage<MessageReplaymentStop, ResponseMessage>(
            {
                type: MESSAGE_POPUP_TO_BACKGROUND.REPLAYMENT_STOP,
                data: activeTab.id!,
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
                    tabID: activeTab.id!,
                    index,
                    updateTab: true,
                },
            },
            () => {
                sendMessage<MessageReplaymentPause, ResponseMessage>(
                    {
                        type: MESSAGE_POPUP_TO_BACKGROUND.REPLAYMENT_PAUSE,
                        data: activeTab.id!,
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
                data: activeTab.id!,
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
            const replayment = await getReplaymentByTabID(activeTab.id!);
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
    const events: any[] = replayment.data.events || [];
    const playPauseText = replayment.status === 'playing'
        ? 'Pause'
        : replaymentAtEnd(replayment)
            ? 'Replay'
            : 'Play';
    const durationText = replayment.duration < (60 * 1_000)
        ? (replayment.duration / 1_000).toFixed(2) + ' seconds'
        : (replayment.duration / (60 * 1_000)).toFixed(2) + ' minutes';
    const eventsText: any = (
            <StyledEventsText>
                {events.length > 0 && (
                    <div
                        style={{
                            width: '16px',
                        }}
                    >
                        {showEvents ? '▲' : '▼'}
                    </div>
                )}

                <div>
                    {events.length === 0 ? 'no' : events.length} event{events.length === 1 ? '' : 's'}
                </div>
            </StyledEventsText>
        );

    return (
        <>
            <h1
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <CopyableLine
                    data={destreamIDGetDisplay(replayment.data.id)}
                    copyMessage=" "
                    viewData=" "
                />

                {replayment.linkageID ? 'playing linkage' : 'replaying session'}
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
                    max={events.length - 1}
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
                    text={eventsText}
                    atClick={() => {
                        if (events.length === 0) {
                            return;
                        }

                        setShowEvents(!showEvents);
                    }}
                    inline={true}
                    theme={plurid}
                />
            </div>

            {showEvents && (
                <StyledEvents>
                    {events.map((event: any, index) => {
                        const data = JSON.parse(event.data);
                        const relativeTime = event.relativeTime / 1_000;

                        const {
                            payload,
                            type,
                        } = data;

                        return (
                            <StyledEvent
                                key={Math.random() + ''}
                                style={{
                                    opacity: index <= replayment.currentIndex ? '0.5' : '1',
                                }}
                            >
                                <StyledEventHeader>
                                    <div>
                                        + {relativeTime} seconds
                                    </div>

                                    <div>
                                    ·
                                    </div>

                                    <div>
                                        {type}
                                    </div>
                                </StyledEventHeader>

                                {payload && (
                                    <pre>
                                        <code>
                                            {JSON.stringify(payload, null, 2)}
                                        </code>
                                    </pre>
                                )}
                            </StyledEvent>
                        );
                    })}
                </StyledEvents>
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
