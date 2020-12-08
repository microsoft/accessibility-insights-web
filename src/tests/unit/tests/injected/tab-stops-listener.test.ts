// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, Times } from 'typemoq';

import { HTMLElementUtils } from 'common/html-element-utils';
import { TabStopEvent } from 'common/types/tab-stop-event';
import { WindowUtils } from 'common/window-utils';
import { VisualizationWindowMessage } from 'injected/drawing-controller';
import { ErrorMessageContent } from 'injected/frameCommunicators/error-message-content';
import { FrameCommunicator, MessageRequest } from 'injected/frameCommunicators/frame-communicator';
import { FrameMessageResponseCallback } from 'injected/frameCommunicators/window-message-handler';
import { ScannerUtils } from 'injected/scanner-utils';
import { TabStopsListener } from 'injected/tab-stops-listener';

describe('TabStopsListenerTest', () => {
    const frameCommunicatorMock: IMock<FrameCommunicator> = Mock.ofType(FrameCommunicator);
    const htmlElementUtilsMock: IMock<HTMLElementUtils> = Mock.ofType(HTMLElementUtils);
    const scannerUtilsMock: IMock<ScannerUtils> = Mock.ofType(ScannerUtils);
    const windowUtilsMock: IMock<WindowUtils> = Mock.ofType(WindowUtils);
    const addEventListenerMock = Mock.ofInstance((eventName, callback) => {});
    const removeEventListenerMock = Mock.ofInstance((eventName, callback) => {});
    const domMock = {
        addEventListener: addEventListenerMock.object,
        removeEventListener: removeEventListenerMock.object,
    };
    let listenerObject: TabStopsListener;

    beforeEach(() => {
        listenerObject = new TabStopsListener(
            frameCommunicatorMock.object,
            windowUtilsMock.object,
            htmlElementUtilsMock.object,
            scannerUtilsMock.object,
            domMock as any,
        );
    });

    afterEach(() => {
        frameCommunicatorMock.reset();
        htmlElementUtilsMock.reset();
        scannerUtilsMock.reset();
        windowUtilsMock.reset();
        addEventListenerMock.reset();
        removeEventListenerMock.reset();
    });

    test('initialize', () => {
        frameCommunicatorMock
            .setup(f => f.subscribe(TabStopsListener.startListeningCommand, It.isAny()))
            .verifiable(Times.once());
        frameCommunicatorMock
            .setup(f => f.subscribe(TabStopsListener.startListeningCommand, It.isAny()))
            .verifiable(Times.once());
        frameCommunicatorMock
            .setup(f => f.subscribe(TabStopsListener.startListeningCommand, It.isAny()))
            .verifiable(Times.once());

        listenerObject.initialize();
        frameCommunicatorMock.verifyAll();
    });

    test('Err: Tab Listener setup in child window', () => {
        windowUtilsMock.setup(w => w.isTopWindow()).returns(() => false);
        frameCommunicatorMock
            .setup(f => f.subscribe(TabStopsListener.startListeningCommand, It.isAny()))
            .verifiable(Times.once());
        frameCommunicatorMock
            .setup(f => f.subscribe(TabStopsListener.startListeningCommand, It.isAny()))
            .verifiable(Times.once());
        frameCommunicatorMock
            .setup(f => f.subscribe(TabStopsListener.startListeningCommand, It.isAny()))
            .verifiable(Times.once());

        listenerObject.initialize();
        const action = () => {
            listenerObject.setTabEventListenerOnMainWindow(null);
        };
        expect(action).toThrowError('Tabstop Listener callback only supported on main window');
    });

    test('startListenToTabStops', () => {
        const onStartListenToTabStopsMock = Mock.ofInstance(() => {});

        onStartListenToTabStopsMock.setup(o => o()).verifiable(Times.once());
        frameCommunicatorMock
            .setup(f => f.subscribe(TabStopsListener.startListeningCommand, It.isAny()))
            .verifiable(Times.once());
        frameCommunicatorMock
            .setup(f => f.subscribe(TabStopsListener.startListeningCommand, It.isAny()))
            .verifiable(Times.once());
        frameCommunicatorMock
            .setup(f => f.subscribe(TabStopsListener.startListeningCommand, It.isAny()))
            .verifiable(Times.once());

        listenerObject.initialize();
        (listenerObject as any).onStartListenToTabStops = onStartListenToTabStopsMock.object;
        listenerObject.startListenToTabStops();

        onStartListenToTabStopsMock.verifyAll();
        frameCommunicatorMock.verifyAll();
    });

    test('StopListenToTabStops', () => {
        const onStopListenToTabStopsMock = Mock.ofInstance(() => {});

        onStopListenToTabStopsMock.setup(o => o()).verifiable(Times.once());
        frameCommunicatorMock
            .setup(f => f.subscribe(TabStopsListener.stopListeningCommand, It.isAny()))
            .verifiable(Times.once());
        frameCommunicatorMock
            .setup(f => f.subscribe(TabStopsListener.stopListeningCommand, It.isAny()))
            .verifiable(Times.once());
        frameCommunicatorMock
            .setup(f => f.subscribe(TabStopsListener.stopListeningCommand, It.isAny()))
            .verifiable(Times.once());

        listenerObject.initialize();
        (listenerObject as any).onStopListenToTabStops = onStopListenToTabStopsMock.object;
        listenerObject.stopListenToTabStops();

        onStopListenToTabStopsMock.verifyAll();
        frameCommunicatorMock.verifyAll();
    });

    test('getFrameElementForWindow: no frame found', () => {
        htmlElementUtilsMock
            .setup(h => h.getAllElementsByTagName('iframe'))
            .returns(() => {
                return [] as any;
            })
            .verifiable(Times.once());
        frameCommunicatorMock
            .setup(f => f.subscribe(TabStopsListener.startListeningCommand, It.isAny()))
            .verifiable(Times.once());
        frameCommunicatorMock
            .setup(f => f.subscribe(TabStopsListener.startListeningCommand, It.isAny()))
            .verifiable(Times.once());
        frameCommunicatorMock
            .setup(f => f.subscribe(TabStopsListener.startListeningCommand, It.isAny()))
            .verifiable(Times.once());

        listenerObject.initialize();
        frameCommunicatorMock.verifyAll();
        expect((listenerObject as any).getFrameElementForWindow(null)).toBeNull();
    });

    test('verify onFocusIn callback in child frame', () => {
        const targetElementStub = {
            outerHTML: 'test html',
        } as HTMLElement;
        const eventStub = {
            target: targetElementStub as EventTarget,
        } as Event;
        const topWindowStub = {};

        htmlElementUtilsMock
            .setup(h => h.getAllElementsByTagName('iframe'))
            .returns(() => {
                return [] as any;
            })
            .verifiable(Times.once());

        windowUtilsMock
            .setup(w => w.isTopWindow())
            .returns(() => false)
            .verifiable(Times.once());

        windowUtilsMock
            .setup(w => w.getParentWindow())
            .returns(() => topWindowStub as any)
            .verifiable(Times.once());

        scannerUtilsMock
            .setup(k => k.getUniqueSelector(targetElementStub as any))
            .returns(() => 'selector')
            .verifiable(Times.once());

        frameCommunicatorMock
            .setup(f => f.subscribe(TabStopsListener.startListeningCommand, It.isAny()))
            .callback((command, startListenToTabStops) => {
                startListenToTabStops();
            })
            .verifiable(Times.once());

        addEventListenerMock
            .setup(a => a('focusin', It.isAny()))
            .callback((eventName, onFocusIn) => {
                onFocusIn(eventStub);
            })
            .verifiable(Times.once());

        frameCommunicatorMock
            .setup(f =>
                f.sendMessage(
                    It.is((req: MessageRequest<TabStopEvent>) => {
                        expect(req.command).toEqual(TabStopsListener.getTabbedElementsCommand);
                        expect(req.win).toEqual(topWindowStub);
                        expect(req.message.target).toMatchObject(['selector']);
                        expect(req.message.html).toEqual(targetElementStub.outerHTML);
                        return true;
                    }),
                ),
            )
            .verifiable(Times.once());

        listenerObject.initialize();
        frameCommunicatorMock.verifyAll();
        windowUtilsMock.verifyAll();
        scannerUtilsMock.verifyAll();
        frameCommunicatorMock.verifyAll();
        addEventListenerMock.verifyAll();
        htmlElementUtilsMock.verifyAll();
    });

    test('startListenToTabStopsInFrame', () => {
        const frameStub = {};
        const startListenToTabStopsInFrameReqStub: MessageRequest<VisualizationWindowMessage> = {
            command: TabStopsListener.startListeningCommand,
            frame: frameStub as any,
        };

        htmlElementUtilsMock
            .setup(h => h.getAllElementsByTagName('iframe'))
            .returns(() => {
                return [frameStub] as any;
            })
            .verifiable(Times.once());

        frameCommunicatorMock
            .setup(f => f.sendMessage(It.isValue(startListenToTabStopsInFrameReqStub)))
            .verifiable(Times.once());

        frameCommunicatorMock
            .setup(f => f.subscribe(TabStopsListener.startListeningCommand, It.isAny()))
            .callback((command, startListenToTabStops) => {
                startListenToTabStops();
            })
            .verifiable(Times.once());

        addEventListenerMock.setup(a => a('focusin', It.isAny())).verifiable(Times.once());

        listenerObject.initialize();
        frameCommunicatorMock.verifyAll();
        windowUtilsMock.verifyAll();
        scannerUtilsMock.verifyAll();
        addEventListenerMock.verifyAll();
        htmlElementUtilsMock.verifyAll();
    });

    test('verify onFocusIn callback in main frame', () => {
        const targetElementStub = {};
        const eventStub = {
            target: targetElementStub,
        } as Event;
        const tabEventListenMock = Mock.ofInstance((tabbedItems: TabStopEvent) => {});

        htmlElementUtilsMock
            .setup(h => h.getAllElementsByTagName('iframe'))
            .returns(() => {
                return [] as any;
            })
            .verifiable(Times.once());

        windowUtilsMock
            .setup(w => w.isTopWindow())
            .returns(() => true)
            .verifiable(Times.exactly(2));

        scannerUtilsMock
            .setup(k => k.getUniqueSelector(targetElementStub as any))
            .returns(() => 'selector')
            .verifiable(Times.once());

        frameCommunicatorMock
            .setup(f => f.subscribe(TabStopsListener.startListeningCommand, It.isAny()))
            .callback((command, startListenToTabStops) => {
                startListenToTabStops();
            })
            .verifiable(Times.once());

        addEventListenerMock
            .setup(a => a('focusin', It.isAny()))
            .callback((eventName, onFocusIn) => {
                onFocusIn(eventStub);
            })
            .verifiable(Times.once());

        tabEventListenMock
            .setup(t =>
                t(
                    It.is((event: TabStopEvent) => {
                        expect(event.target).toEqual(['selector']);
                        return true;
                    }),
                ),
            )
            .verifiable(Times.once());

        listenerObject.setTabEventListenerOnMainWindow(tabEventListenMock.object);
        listenerObject.initialize();

        frameCommunicatorMock.verifyAll();
        windowUtilsMock.verifyAll();
        scannerUtilsMock.verifyAll();
        frameCommunicatorMock.verifyAll();
        addEventListenerMock.verifyAll();
        htmlElementUtilsMock.verifyAll();
    });

    test('verify startListenToTabStops', () => {
        const currentFocusedElementStub = {
            outerHTML: 'test html',
        };
        const tabEventListenerMock = Mock.ofInstance((tabStopEvent: TabStopEvent) => {});

        windowUtilsMock
            .setup(w => w.isTopWindow())
            .returns(() => true)
            .verifiable(Times.exactly(3));

        scannerUtilsMock
            .setup(k => k.getUniqueSelector(currentFocusedElementStub as any))
            .returns(element => 'selector')
            .verifiable(Times.once());

        addEventListenerMock.setup(a => a('focusin', It.isAny())).verifiable(Times.once());

        htmlElementUtilsMock
            .setup(h => h.getAllElementsByTagName('iframe'))
            .returns(() => [] as any)
            .verifiable(Times.once());

        tabEventListenerMock
            .setup(t =>
                t(
                    It.is((tabStopEvent: TabStopEvent) => {
                        expect(tabStopEvent.target).toMatchObject(['selector']);
                        expect(tabStopEvent.html).toEqual(currentFocusedElementStub.outerHTML);
                        return true;
                    }),
                ),
            )
            .verifiable(Times.once());

        listenerObject.initialize();
        listenerObject.setTabEventListenerOnMainWindow(tabEventListenerMock.object);
        listenerObject.startListenToTabStops();

        frameCommunicatorMock.verifyAll();
        frameCommunicatorMock.verifyAll();
        removeEventListenerMock.verifyAll();
        htmlElementUtilsMock.verifyAll();
    });

    test('verify stopListenToTabStops', () => {
        const frameStub = {};

        htmlElementUtilsMock
            .setup(h => h.getAllElementsByTagName('iframe'))
            .returns(() => {
                return [frameStub] as any;
            })
            .verifiable(Times.once());

        frameCommunicatorMock
            .setup(f => f.subscribe(TabStopsListener.stopListeningCommand, It.isAny()))
            .callback((command, stopListeningCommand) => {
                stopListeningCommand();
            })
            .verifiable(Times.once());

        frameCommunicatorMock
            .setup(f =>
                f.sendMessage(
                    It.is((req: MessageRequest<TabStopEvent>) => {
                        expect(req.command).toEqual(TabStopsListener.stopListeningCommand);
                        expect(req.frame).toEqual(frameStub);
                        return true;
                    }),
                ),
            )
            .verifiable(Times.once());

        removeEventListenerMock.setup(a => a('focusin', It.isAny())).verifiable(Times.once());

        listenerObject.initialize();

        frameCommunicatorMock.verifyAll();
        frameCommunicatorMock.verifyAll();
        removeEventListenerMock.verifyAll();
        htmlElementUtilsMock.verifyAll();
    });

    test('verify onGetTabbedElements in child frame', () => {
        const srcWindowStub = {};
        const tabStopEventStub: TabStopEvent = {
            target: ['selector'],
            html: 'test',
            timestamp: 1,
        };
        const frameStub = {};
        const parentWindowStub = {};
        const messageStub: MessageRequest<TabStopEvent> = {
            win: parentWindowStub as any,
            command: TabStopsListener.getTabbedElementsCommand,
            message: {
                target: ['frame1', 'selector'],
                timestamp: 1,
                html: 'test',
            },
        };

        htmlElementUtilsMock
            .setup(h => h.getAllElementsByTagName('iframe'))
            .returns(() => {
                return [frameStub] as any;
            })
            .verifiable(Times.once());

        htmlElementUtilsMock
            .setup(h => h.getContentWindow(frameStub as any))
            .returns(() => {
                return srcWindowStub as any;
            })
            .verifiable(Times.once());

        windowUtilsMock
            .setup(w => w.isTopWindow())
            .returns(() => false)
            .verifiable(Times.once());

        windowUtilsMock
            .setup(w => w.getParentWindow())
            .returns(() => parentWindowStub as any)
            .verifiable(Times.once());

        scannerUtilsMock
            .setup(k => k.getUniqueSelector(frameStub as any))
            .returns(() => 'frame1')
            .verifiable(Times.once());

        frameCommunicatorMock
            .setup(f => f.subscribe(TabStopsListener.getTabbedElementsCommand, It.isAny()))
            .callback(
                (
                    command,
                    onGetTabbedElements: (
                        tabStopEvent: TabStopEvent,
                        error: ErrorMessageContent,
                        messageSourceWin: Window,
                        responder?: FrameMessageResponseCallback,
                    ) => {},
                ) => {
                    onGetTabbedElements(tabStopEventStub, null, srcWindowStub as any);
                },
            )
            .verifiable(Times.once());

        frameCommunicatorMock
            .setup(f => f.sendMessage(It.isObjectWith(messageStub)))
            .verifiable(Times.once());

        listenerObject.initialize();
        frameCommunicatorMock.verifyAll();
        windowUtilsMock.verifyAll();
        scannerUtilsMock.verifyAll();
        frameCommunicatorMock.verifyAll();
        addEventListenerMock.verifyAll();
        htmlElementUtilsMock.verifyAll();
    });

    test('verify onGetTabbedElements in main frame', () => {
        const srcWindowStub = {};
        const tabStopEventStub: TabStopEvent = {
            target: ['selector'],
            html: 'test',
            timestamp: 1,
        };
        const frameStub = {};
        const tabEventListenMock = Mock.ofInstance((tabbedItems: TabStopEvent) => {});
        const finalEventStub = {
            target: ['frame1', 'selector'],
            html: 'test',
            timestamp: 1,
        };

        htmlElementUtilsMock
            .setup(h => h.getAllElementsByTagName('iframe'))
            .returns(() => {
                return [frameStub] as any;
            })
            .verifiable(Times.once());

        htmlElementUtilsMock
            .setup(h => h.getContentWindow(frameStub as any))
            .returns(() => {
                return srcWindowStub as any;
            })
            .verifiable(Times.once());

        windowUtilsMock
            .setup(w => w.isTopWindow())
            .returns(() => true)
            .verifiable(Times.exactly(2));

        tabEventListenMock.setup(t => t(It.isObjectWith(finalEventStub))).verifiable(Times.once());

        scannerUtilsMock
            .setup(k => k.getUniqueSelector(frameStub as any))
            .returns(() => 'frame1')
            .verifiable(Times.once());

        frameCommunicatorMock
            .setup(f => f.subscribe(TabStopsListener.getTabbedElementsCommand, It.isAny()))
            .callback(
                (
                    command,
                    onGetTabbedElements: (
                        tabStopEvent: TabStopEvent,
                        error: ErrorMessageContent,
                        messageSourceWin: Window,
                        responder?: FrameMessageResponseCallback,
                    ) => {},
                ) => {
                    onGetTabbedElements(tabStopEventStub, null, srcWindowStub as any);
                },
            )
            .verifiable(Times.once());

        listenerObject.setTabEventListenerOnMainWindow(tabEventListenMock.object);
        listenerObject.initialize();
        frameCommunicatorMock.verifyAll();
        windowUtilsMock.verifyAll();
        scannerUtilsMock.verifyAll();
        frameCommunicatorMock.verifyAll();
        addEventListenerMock.verifyAll();
        htmlElementUtilsMock.verifyAll();
    });

    test('verify onGetTabbedElements in main frame', () => {
        const srcWindowStub = {};
        const tabStopEventStub: TabStopEvent = {
            target: ['selector'],
            html: 'test',
            timestamp: 1,
        };
        const frameStub = {};
        let onGetTabbedElementsFunc: (
            tabStopEvent: TabStopEvent,
            error: ErrorMessageContent,
            messageSourceWin: Window,
            responder?: FrameMessageResponseCallback,
        ) => void;

        htmlElementUtilsMock
            .setup(h => h.getAllElementsByTagName('iframe'))
            .returns(() => {
                return [frameStub] as any;
            })
            .verifiable(Times.once());

        htmlElementUtilsMock
            .setup(h => h.getContentWindow(frameStub as any))
            .returns(() => {
                return srcWindowStub as any;
            })
            .verifiable(Times.once());

        windowUtilsMock
            .setup(w => w.isTopWindow())
            .returns(() => true)
            .verifiable(Times.exactly(2));

        scannerUtilsMock
            .setup(k => k.getUniqueSelector(frameStub as any))
            .returns(() => 'frame1')
            .verifiable(Times.once());

        frameCommunicatorMock
            .setup(f => f.subscribe(TabStopsListener.getTabbedElementsCommand, It.isAny()))
            .callback(
                (
                    command,
                    onGetTabbedElements: (
                        tabStopEvent: TabStopEvent,
                        error: ErrorMessageContent,
                        messageSourceWin: Window,
                        responder?: FrameMessageResponseCallback,
                    ) => {},
                ) => {
                    onGetTabbedElementsFunc = onGetTabbedElements;
                },
            )
            .verifiable(Times.once());

        listenerObject.initialize();

        const action = () => {
            onGetTabbedElementsFunc(tabStopEventStub, null, srcWindowStub as any);
        };
        expect(action).toThrowError('Tab Listener not setup in main window');
    });

    test('unable to get frame element for the tabbed element', () => {
        const srcWindowStub = {};
        const tabStopEventStub: TabStopEvent = {
            target: ['selector'],
            html: 'test',
            timestamp: 1,
        };
        const frameStub = {};
        const tabEventListenMock = Mock.ofInstance((tabbedItems: TabStopEvent) => {});
        const finalEventStub = {
            target: ['frame1', 'selector'],
            html: 'test',
            timestamp: 1,
        };
        let onGetTabbedElementsFunc: (
            tabStopEvent: TabStopEvent,
            error: ErrorMessageContent,
            messageSourceWin: Window,
            responder?: FrameMessageResponseCallback,
        ) => void;

        htmlElementUtilsMock
            .setup(h => h.getAllElementsByTagName('iframe'))
            .returns(() => {
                return [frameStub] as any;
            })
            .verifiable(Times.once());

        htmlElementUtilsMock
            .setup(h => h.getContentWindow(frameStub as any))
            .returns(() => {
                return null as any;
            })
            .verifiable(Times.once());

        windowUtilsMock
            .setup(w => w.isTopWindow())
            .returns(() => true)
            .verifiable(Times.exactly(2));

        tabEventListenMock.setup(t => t(It.isObjectWith(finalEventStub))).verifiable(Times.once());

        scannerUtilsMock
            .setup(k => k.getUniqueSelector(frameStub as any))
            .returns(() => 'frame1')
            .verifiable(Times.once());

        frameCommunicatorMock
            .setup(f => f.subscribe(TabStopsListener.getTabbedElementsCommand, It.isAny()))
            .callback(
                (
                    command,
                    onGetTabbedElements: (
                        tabStopEvent: TabStopEvent,
                        error: ErrorMessageContent,
                        messageSourceWin: Window,
                        responder?: FrameMessageResponseCallback,
                    ) => {},
                ) => {
                    onGetTabbedElementsFunc = onGetTabbedElements;
                },
            )
            .verifiable(Times.once());

        listenerObject.setTabEventListenerOnMainWindow(tabEventListenMock.object);
        listenerObject.initialize();
        const action = () => {
            onGetTabbedElementsFunc(tabStopEventStub, null, srcWindowStub as any);
        };
        expect(action).toThrowError('unable to get frame element for the tabbed element');
    });
});
