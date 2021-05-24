// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { HTMLElementUtils } from 'common/html-element-utils';
import { TabStopEvent } from 'common/types/tab-stop-event';
import { WindowUtils } from 'common/window-utils';
import { FrameMessenger } from 'injected/frameCommunicators/frame-messenger';
import {
    CommandMessage,
    PromiseWindowCommandMessageListener,
} from 'injected/frameCommunicators/respondable-command-message-communicator';
import { TabStopsListener } from 'injected/tab-stops-listener';
import { IMock, It, Mock, Times } from 'typemoq';

describe('TabStopsListenerTest', () => {
    let frameMessengerMock: IMock<FrameMessenger>;
    let windowUtilsMock: IMock<WindowUtils>;
    let htmlElementUtilsMock: IMock<HTMLElementUtils>;
    let getUniqueSelectorMock: IMock<(element: HTMLElement) => string>;
    let addEventListenerMock;
    let removeEventListenerMock;
    let domMock;
    let testSubject: TabStopsListener;

    beforeEach(() => {
        frameMessengerMock = Mock.ofType(FrameMessenger);
        windowUtilsMock = Mock.ofType(WindowUtils);
        htmlElementUtilsMock = Mock.ofType(HTMLElementUtils);
        getUniqueSelectorMock = Mock.ofInstance(e => null);
        addEventListenerMock = Mock.ofInstance((eventName, callback) => {});
        removeEventListenerMock = Mock.ofInstance((eventName, callback) => {});
        domMock = {
            addEventListener: addEventListenerMock.object,
            removeEventListener: removeEventListenerMock.object,
        };
        testSubject = new TabStopsListener(
            frameMessengerMock.object,
            windowUtilsMock.object,
            htmlElementUtilsMock.object,
            getUniqueSelectorMock.object,
            domMock as any,
        );
    });

    afterEach(() => {
        htmlElementUtilsMock.reset();
        getUniqueSelectorMock.reset();
        windowUtilsMock.reset();
        addEventListenerMock.reset();
        removeEventListenerMock.reset();
    });

    test('initialize', () => {
        frameMessengerMock
            .setup(f => f.addMessageListener(TabStopsListener.startListeningCommand, It.isAny()))
            .verifiable(Times.once());
        frameMessengerMock
            .setup(f => f.addMessageListener(TabStopsListener.getTabbedElementsCommand, It.isAny()))
            .verifiable(Times.once());
        frameMessengerMock
            .setup(f => f.addMessageListener(TabStopsListener.stopListeningCommand, It.isAny()))
            .verifiable(Times.once());

        testSubject.initialize();
        frameMessengerMock.verifyAll();
    });

    test('Err: Tab Listener setup in child window', () => {
        windowUtilsMock.setup(w => w.isTopWindow()).returns(() => false);

        const action = () => {
            testSubject.setTabEventListenerOnMainWindow(null);
        };
        expect(action).toThrowError('Tabstop Listener callback only supported on main window');
    });

    test('startListenToTabStops', () => {
        const onStartListenToTabStopsMock = Mock.ofInstance(() => {});

        onStartListenToTabStopsMock.setup(o => o()).verifiable(Times.once());
        frameMessengerMock
            .setup(f => f.addMessageListener(TabStopsListener.startListeningCommand, It.isAny()))
            .verifiable(Times.once());

        testSubject.initialize();
        (testSubject as any).onStartListenToTabStops = onStartListenToTabStopsMock.object;
        testSubject.startListenToTabStops();

        onStartListenToTabStopsMock.verifyAll();
        frameMessengerMock.verifyAll();
    });

    test('StopListenToTabStops', () => {
        const onStopListenToTabStopsMock = Mock.ofInstance(() => {});

        onStopListenToTabStopsMock.setup(o => o()).verifiable(Times.once());
        frameMessengerMock
            .setup(f => f.addMessageListener(TabStopsListener.stopListeningCommand, It.isAny()))
            .verifiable(Times.once());

        testSubject.initialize();
        (testSubject as any).onStopListenToTabStops = onStopListenToTabStopsMock.object;
        testSubject.stopListenToTabStops();

        onStopListenToTabStopsMock.verifyAll();
        frameMessengerMock.verifyAll();
    });

    test('getFrameElementForWindow: no frame found', () => {
        htmlElementUtilsMock
            .setup(h => h.getAllElementsByTagName('iframe'))
            .returns(() => {
                return [] as any;
            })
            .verifiable(Times.once());

        testSubject.initialize();
        expect((testSubject as any).getFrameElementForWindow(null)).toBeNull();
        htmlElementUtilsMock.verifyAll();
    });

    test('verify onFocusIn callback in child frame', () => {
        const targetElementStub = {
            outerHTML: 'test html',
        } as HTMLElement;
        const eventStub = {
            target: targetElementStub as EventTarget,
        } as Event;
        const topWindowStub = {};

        frameMessengerMock
            .setup(f => f.addMessageListener(TabStopsListener.startListeningCommand, It.isAny()))
            .callback(async (command, startListenToTabStops) => {
                await startListenToTabStops();
            })
            .verifiable(Times.once());

        addEventListenerMock
            .setup(a => a('focusin', It.isAny()))
            .callback(async (eventName, onFocusIn) => {
                await onFocusIn(eventStub);
            })
            .verifiable(Times.once());

        windowUtilsMock
            .setup(w => w.isTopWindow())
            .returns(() => false)
            .verifiable(Times.once());

        htmlElementUtilsMock
            .setup(h => h.getAllElementsByTagName('iframe'))
            .returns(() => {
                return [] as any;
            })
            .verifiable(Times.once());

        windowUtilsMock
            .setup(w => w.getParentWindow())
            .returns(() => topWindowStub as any)
            .verifiable(Times.once());

        getUniqueSelectorMock
            .setup(m => m(targetElementStub as any))
            .returns(() => 'selector')
            .verifiable(Times.once());

        frameMessengerMock
            .setup(f =>
                f.sendMessageToWindow(
                    topWindowStub as Window,
                    It.is(message => {
                        expect(message.command).toEqual(TabStopsListener.getTabbedElementsCommand);
                        expect(message.payload.target).toMatchObject(['selector']);
                        expect(message.payload.html).toEqual(targetElementStub.outerHTML);
                        return true;
                    }),
                ),
            )
            .verifiable(Times.once());

        testSubject.initialize();
        windowUtilsMock.verifyAll();
        getUniqueSelectorMock.verifyAll();
        frameMessengerMock.verifyAll();
        addEventListenerMock.verifyAll();
        htmlElementUtilsMock.verifyAll();
    });

    test('startListenToTabStopsInFrame', () => {
        const frameStub = {};
        const startListenToTabStopsInFrameMessage: CommandMessage = {
            command: TabStopsListener.startListeningCommand,
        };

        htmlElementUtilsMock
            .setup(h => h.getAllElementsByTagName('iframe'))
            .returns(() => {
                return [frameStub] as any;
            })
            .verifiable(Times.once());

        frameMessengerMock
            .setup(f =>
                f.sendMessageToFrame(It.isAny(), It.isValue(startListenToTabStopsInFrameMessage)),
            )
            .verifiable(Times.once());

        frameMessengerMock
            .setup(f => f.addMessageListener(TabStopsListener.startListeningCommand, It.isAny()))
            .callback(async (command, startListenToTabStops) => {
                await startListenToTabStops();
            })
            .verifiable(Times.once());

        addEventListenerMock.setup(a => a('focusin', It.isAny())).verifiable(Times.once());

        testSubject.initialize();
        frameMessengerMock.verifyAll();
        windowUtilsMock.verifyAll();
        getUniqueSelectorMock.verifyAll();
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

        getUniqueSelectorMock
            .setup(m => m(targetElementStub as any))
            .returns(() => 'selector')
            .verifiable(Times.once());

        frameMessengerMock
            .setup(f => f.addMessageListener(TabStopsListener.startListeningCommand, It.isAny()))
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

        testSubject.setTabEventListenerOnMainWindow(tabEventListenMock.object);
        testSubject.initialize();

        frameMessengerMock.verifyAll();
        windowUtilsMock.verifyAll();
        getUniqueSelectorMock.verifyAll();
        frameMessengerMock.verifyAll();
        addEventListenerMock.verifyAll();
        htmlElementUtilsMock.verifyAll();
    });

    test('verify startListenToTabStops', async () => {
        const currentFocusedElementStub = {
            outerHTML: 'test html',
        };
        const tabEventListenerMock = Mock.ofInstance((tabStopEvent: TabStopEvent) => {});

        windowUtilsMock
            .setup(w => w.isTopWindow())
            .returns(() => true)
            .verifiable(Times.exactly(3));

        getUniqueSelectorMock
            .setup(m => m(currentFocusedElementStub as any))
            .returns(() => 'selector')
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

        testSubject.initialize();
        testSubject.setTabEventListenerOnMainWindow(tabEventListenerMock.object);
        await testSubject.startListenToTabStops();

        frameMessengerMock.verifyAll();
        frameMessengerMock.verifyAll();
        removeEventListenerMock.verifyAll();
        htmlElementUtilsMock.verifyAll();
    });

    test('verify stopListenToTabStops', () => {
        const frameStub = {};
        const stopListenToTabStopsInFrameMessage: CommandMessage = {
            command: TabStopsListener.stopListeningCommand,
        };

        htmlElementUtilsMock
            .setup(h => h.getAllElementsByTagName('iframe'))
            .returns(() => {
                return [frameStub] as any;
            })
            .verifiable(Times.once());

        frameMessengerMock
            .setup(f => f.addMessageListener(TabStopsListener.stopListeningCommand, It.isAny()))
            .callback(async (command, stopListeningCommand) => {
                await stopListeningCommand();
            })
            .verifiable(Times.once());

        frameMessengerMock
            .setup(f =>
                f.sendMessageToFrame(It.isAny(), It.isValue(stopListenToTabStopsInFrameMessage)),
            )
            .verifiable(Times.once());

        removeEventListenerMock.setup(a => a('focusin', It.isAny())).verifiable(Times.once());

        testSubject.initialize();

        frameMessengerMock.verifyAll();
        frameMessengerMock.verifyAll();
        removeEventListenerMock.verifyAll();
        htmlElementUtilsMock.verifyAll();
    });

    test('verify onGetTabbedElements in child frame', () => {
        const srcWindowStub = {};
        const tabStopMessageStub: CommandMessage = {
            command: TabStopsListener.getTabbedElementsCommand,
            payload: {
                target: ['selector'],
                html: 'test',
                timestamp: 1,
            },
        };
        const frameStub = {};
        const parentWindowStub = {};
        const messageStub: CommandMessage = {
            command: TabStopsListener.getTabbedElementsCommand,
            payload: {
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

        getUniqueSelectorMock
            .setup(m => m(frameStub as any))
            .returns(() => 'frame1')
            .verifiable(Times.once());

        frameMessengerMock
            .setup(f => f.addMessageListener(TabStopsListener.getTabbedElementsCommand, It.isAny()))
            .callback(async (command, onGetTabbedElements) => {
                await onGetTabbedElements(tabStopMessageStub, srcWindowStub as Window);
            })
            .verifiable(Times.once());

        frameMessengerMock
            .setup(f =>
                f.sendMessageToWindow(parentWindowStub as Window, It.isObjectWith(messageStub)),
            )
            .verifiable(Times.once());

        testSubject.initialize();
        windowUtilsMock.verifyAll();
        getUniqueSelectorMock.verifyAll();
        frameMessengerMock.verifyAll();
        addEventListenerMock.verifyAll();
        htmlElementUtilsMock.verifyAll();
    });

    test('verify onGetTabbedElements in main frame', () => {
        const srcWindowStub = {};
        const tabStopMessageStub: CommandMessage = {
            command: TabStopsListener.getTabbedElementsCommand,
            payload: {
                target: ['selector'],
                html: 'test',
                timestamp: 1,
            },
        };
        const frameStub = {};
        const tabEventListenMock = Mock.ofInstance((tabbedItems: TabStopEvent) => {});
        const finalEventStub: TabStopEvent = {
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

        getUniqueSelectorMock
            .setup(m => m(frameStub as any))
            .returns(() => 'frame1')
            .verifiable(Times.once());

        frameMessengerMock
            .setup(f => f.addMessageListener(TabStopsListener.getTabbedElementsCommand, It.isAny()))
            .callback(async (command, onGetTabbedElements) => {
                await onGetTabbedElements(tabStopMessageStub, srcWindowStub as Window);
            })
            .verifiable(Times.once());

        testSubject.setTabEventListenerOnMainWindow(tabEventListenMock.object);
        testSubject.initialize();
        windowUtilsMock.verifyAll();
        getUniqueSelectorMock.verifyAll();
        frameMessengerMock.verifyAll();
        addEventListenerMock.verifyAll();
        htmlElementUtilsMock.verifyAll();
    });

    test('verify onGetTabbedElements in main frame', async () => {
        const srcWindowStub = {};
        const tabStopMessageStub: CommandMessage = {
            command: TabStopsListener.getTabbedElementsCommand,
            payload: {
                target: ['selector'],
                html: 'test',
                timestamp: 1,
            },
        };
        const frameStub = {};
        let onGetTabbedElementsFunc: PromiseWindowCommandMessageListener;

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

        getUniqueSelectorMock
            .setup(m => m(frameStub as any))
            .returns(() => 'frame1')
            .verifiable(Times.once());

        frameMessengerMock
            .setup(f => f.addMessageListener(TabStopsListener.getTabbedElementsCommand, It.isAny()))
            .callback((command, onGetTabbedElements: PromiseWindowCommandMessageListener) => {
                onGetTabbedElementsFunc = onGetTabbedElements;
                return null;
            })
            .verifiable(Times.once());

        testSubject.initialize();

        await expect(
            onGetTabbedElementsFunc(tabStopMessageStub, srcWindowStub as Window),
        ).rejects.toThrowError('Tab Listener not setup in main window');
    });

    test('unable to get frame element for the tabbed element', async () => {
        const srcWindowStub = {};
        const tabStopMessageStub: CommandMessage = {
            command: TabStopsListener.getTabbedElementsCommand,
            payload: {
                target: ['selector'],
                html: 'test',
                timestamp: 1,
            },
        };
        const frameStub = {};
        const tabEventListenMock = Mock.ofInstance((tabbedItems: TabStopEvent) => {});
        const finalEventStub = {
            target: ['frame1', 'selector'],
            html: 'test',
            timestamp: 1,
        };
        let onGetTabbedElementsFunc: PromiseWindowCommandMessageListener;

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

        getUniqueSelectorMock
            .setup(m => m(frameStub as any))
            .returns(() => 'frame1')
            .verifiable(Times.once());

        frameMessengerMock
            .setup(f => f.addMessageListener(TabStopsListener.getTabbedElementsCommand, It.isAny()))
            .callback((command, onGetTabbedElements: PromiseWindowCommandMessageListener) => {
                onGetTabbedElementsFunc = onGetTabbedElements;
                return null;
            })
            .verifiable(Times.once());

        testSubject.setTabEventListenerOnMainWindow(tabEventListenMock.object);
        testSubject.initialize();

        await expect(
            onGetTabbedElementsFunc(tabStopMessageStub, srcWindowStub as Window),
        ).rejects.toThrowError('unable to get frame element for the tabbed element');
    });
});
