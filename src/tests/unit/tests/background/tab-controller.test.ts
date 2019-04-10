// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { BrowserAdapter, ChromeAdapter } from '../../../../background/browser-adapter';
import { DetailsViewController } from '../../../../background/details-view-controller';
import { Interpreter } from '../../../../background/interpreter';
import { FeatureFlagStore } from '../../../../background/stores/global/feature-flag-store';
import { TabToContextMap } from '../../../../background/tab-context';
import { TabContextBroadcaster } from '../../../../background/tab-context-broadcaster';
import { TabContextFactory } from '../../../../background/tab-context-factory';
import { TabController } from '../../../../background/tab-controller';
import { TelemetryEventHandler } from '../../../../background/telemetry/telemetry-event-handler';
import { Message } from '../../../../common/message';
import { Messages } from '../../../../common/messages';
import { DictionaryStringTo } from '../../../../types/common-types';
import { Logger } from './../../../../common/logging/logger';

describe('TabControllerTest', () => {
    let testSubject: TabController;
    let mockBroadcasterStrictMock: IMock<TabContextBroadcaster>;
    let mockChromeAdapter: IMock<BrowserAdapter>;
    let mockDetailsViewController: IMock<DetailsViewController>;
    let tabInterpreterMap: TabToContextMap;
    let featureFlagStoreMock: IMock<FeatureFlagStore>;
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let tabContextFactoryMock: IMock<TabContextFactory>;
    let onDetailsViewTabRemoved: (tabId: number) => void;
    let logMock: IMock<(msg: string) => void>;
    const LoggerStub: Logger = {
        log: null,
        error: null,
    };

    function setupCreateTabContextMock(broadCastDelegate: () => void, tabContext, tabId: number): void {
        tabContextFactoryMock
            .setup(factory =>
                factory.createTabContext(broadCastDelegate, mockChromeAdapter.object, mockDetailsViewController.object, tabId),
            )
            .returns(() => tabContext)
            .verifiable(Times.once());
    }

    function createTabControllerWithoutFeatureFlag(tabcContextMap: TabToContextMap): TabController {
        return new TabController(
            tabcContextMap,
            mockBroadcasterStrictMock.object,
            mockChromeAdapter.object,
            mockDetailsViewController.object,
            tabContextFactoryMock.object,
            LoggerStub,
        );
    }

    beforeEach(() => {
        logMock = Mock.ofInstance((msg: string) => {});
        LoggerStub.log = logMock.object;
        mockBroadcasterStrictMock = Mock.ofType<TabContextBroadcaster>(null, MockBehavior.Strict);
        mockChromeAdapter = Mock.ofType(ChromeAdapter);
        mockDetailsViewController = Mock.ofType<DetailsViewController>();
        featureFlagStoreMock = Mock.ofType(FeatureFlagStore);
        telemetryEventHandlerMock = Mock.ofType(TelemetryEventHandler);

        tabInterpreterMap = {};
        tabContextFactoryMock = Mock.ofType(TabContextFactory);
        mockDetailsViewController
            .setup(dvc => dvc.setupDetailsViewTabRemovedHandler(It.isAny()))
            .callback(cb => {
                onDetailsViewTabRemoved = cb;
            })
            .verifiable(Times.once());

        testSubject = new TabController(
            tabInterpreterMap,
            mockBroadcasterStrictMock.object,
            mockChromeAdapter.object,
            mockDetailsViewController.object,
            tabContextFactoryMock.object,
            LoggerStub,
        );

        mockChromeAdapter.reset();
    });

    afterEach(() => {
        mockDetailsViewController.verifyAll();
        mockChromeAdapter.reset();
        mockDetailsViewController.reset();
        featureFlagStoreMock.reset();
        telemetryEventHandlerMock.reset();
    });

    test('initialize', () => {
        mockChromeAdapter.setup(mca => mca.tabsQuery(It.isValue({}), It.isAny())).verifiable(Times.once());
        mockChromeAdapter.setup(mca => mca.addListenerOnConnect(It.isAny())).verifiable(Times.once());
        mockChromeAdapter.setup(mca => mca.addListenerToWebNavigationUpdated(It.isAny())).verifiable(Times.once());
        mockChromeAdapter.setup(mca => mca.addListenerToTabsOnRemoved(It.isAny())).verifiable(Times.once());
        mockChromeAdapter.setup(mca => mca.addListenerToTabsOnUpdated(It.isAny())).verifiable(Times.once());

        testSubject.initialize();

        mockChromeAdapter.verifyAll();
    });

    test('register onConnect listener', () => {
        mockChromeAdapter
            .setup(mca => mca.addListenerOnConnect(It.isAny()))
            .callback(cb => {})
            .verifiable(Times.once());

        testSubject.initialize();
        mockChromeAdapter.verifyAll();
    });

    test('onTabLoad: for main frame', () => {
        let getTabCallback: (tab: chrome.tabs.Tab) => void;
        let rejectCallback: () => void;
        const tabId = 1;
        const getTabCallbackInput = {
            data: 'abc',
        };
        const interpretInput: Message = {
            type: Messages.Tab.Update,
            payload: getTabCallbackInput,
            tabId: tabId,
        };

        const broadcastDelegate = () => {};
        const interpreterMock = Mock.ofType(Interpreter);
        interpreterMock.setup(im => im.interpret(It.isValue(interpretInput))).verifiable(Times.once());

        const tabContextMock = {
            interpreter: interpreterMock.object,
        };

        mockBroadcasterStrictMock
            .setup(md => md.getBroadcastMessageDelegate(tabId))
            .returns(() => broadcastDelegate)
            .verifiable(Times.once());

        let tabUpdatedCallback: (details: chrome.webNavigation.WebNavigationFramedCallbackDetails) => void = null;

        mockChromeAdapter
            .setup(ca => ca.addListenerToWebNavigationUpdated(It.isAny()))
            .callback(cb => {
                tabUpdatedCallback = cb;
            })
            .verifiable(Times.once());

        mockChromeAdapter
            .setup(mca => mca.getTab(It.isValue(tabId), It.isAny(), It.isAny()))
            .returns((id, resolve, reject) => {
                getTabCallback = resolve;
                rejectCallback = reject;
            })
            .verifiable(Times.once());
        logMock.setup(log => log(`updated tab with Id ${tabId} not found`)).verifiable(Times.once());

        setupCreateTabContextMock(broadcastDelegate, tabContextMock, tabId);

        testSubject.initialize();

        tabUpdatedCallback({ tabId: tabId, frameId: 0 } as chrome.webNavigation.WebNavigationFramedCallbackDetails);

        getTabCallback(getTabCallbackInput as any);
        rejectCallback();

        interpreterMock.verifyAll();
        mockBroadcasterStrictMock.verifyAll();
        mockChromeAdapter.verifyAll();
        tabContextFactoryMock.verifyAll();
        logMock.verifyAll();
        expect(tabInterpreterMap[tabId]).toBe(tabContextMock);
    });

    test('onTabLoad: for child frame', () => {
        let tabUpdatedCallback: (details: chrome.webNavigation.WebNavigationFramedCallbackDetails) => void = null;

        mockBroadcasterStrictMock.setup(mca => mca.getBroadcastMessageDelegate(It.isAny())).verifiable(Times.never());

        mockChromeAdapter
            .setup(mca => mca.addListenerOnWindowsFocusChanged(It.isAny()))
            .callback(cb => {
                tabUpdatedCallback = cb;
            });

        tabContextFactoryMock
            .setup(factory => factory.createTabContext(It.isAny(), It.isAny(), It.isAny(), It.isAny()))
            .verifiable(Times.never());

        testSubject.initialize();

        tabUpdatedCallback({ tabId: 1, frameId: 2 } as chrome.webNavigation.WebNavigationFramedCallbackDetails);

        mockBroadcasterStrictMock.verifyAll();
        mockChromeAdapter.verifyAll();
    });

    test('onTabRemoved', () => {
        const tabId = 1;
        let tabUpdatedCallback: (details: chrome.webNavigation.WebNavigationFramedCallbackDetails) => void = null;
        let tabRemovedCallback: Function = null;
        const interpretInput: Message = {
            type: Messages.Tab.Remove,
            payload: null,
            tabId: tabId,
        };
        const boradcastMessageDelegateMock = Mock.ofInstance(() => {});

        mockBroadcasterStrictMock
            .setup(mca => mca.getBroadcastMessageDelegate(tabId))
            .returns(() => boradcastMessageDelegateMock.object)
            .verifiable(Times.once());

        const interpreterMock = Mock.ofType(Interpreter);
        interpreterMock.setup(im => im.interpret(It.isValue(interpretInput))).verifiable(Times.once());

        const tabContextMock = {
            interpreter: interpreterMock.object,
        };

        mockChromeAdapter
            .setup(ca => ca.addListenerToWebNavigationUpdated(It.isAny()))
            .callback(cb => {
                tabUpdatedCallback = cb;
            })
            .verifiable(Times.once());
        mockChromeAdapter
            .setup(ca => ca.addListenerToTabsOnRemoved(It.isAny()))
            .callback(cb => {
                tabRemovedCallback = cb;
            });

        setupCreateTabContextMock(boradcastMessageDelegateMock.object, tabContextMock, tabId);
        testSubject.initialize();

        tabUpdatedCallback({ tabId: tabId, frameId: 0 } as chrome.webNavigation.WebNavigationFramedCallbackDetails);
        tabRemovedCallback(tabId);

        interpreterMock.verifyAll();
        mockBroadcasterStrictMock.verifyAll();
        mockChromeAdapter.verifyAll();
        expect(tabInterpreterMap[tabId]).toBeUndefined();
    });

    test('onDetailsViewTabRemoved', () => {
        let tabUpdatedCallback: (details: chrome.webNavigation.WebNavigationFramedCallbackDetails) => void = null;
        const tabId = 2;
        const interpretInput: Message = {
            type: Messages.Visualizations.DetailsView.Close,
            payload: null,
            tabId: tabId,
        };
        const boradcastMessageDelegateMock = Mock.ofInstance(() => {});
        mockBroadcasterStrictMock
            .setup(mb => mb.getBroadcastMessageDelegate(tabId))
            .returns(() => boradcastMessageDelegateMock.object)
            .verifiable(Times.once());

        const interpreterMock = Mock.ofType(Interpreter);
        interpreterMock.setup(im => im.interpret(It.isValue(interpretInput))).verifiable(Times.once());

        const tabContextMock = {
            interpreter: interpreterMock.object,
        };

        mockChromeAdapter
            .setup(ca => ca.addListenerToWebNavigationUpdated(It.isAny()))
            .callback(cb => {
                tabUpdatedCallback = cb;
            })
            .verifiable(Times.once());

        setupCreateTabContextMock(boradcastMessageDelegateMock.object, tabContextMock, tabId);
        testSubject.initialize();

        tabUpdatedCallback({ tabId: tabId, frameId: 0 } as chrome.webNavigation.WebNavigationFramedCallbackDetails);
        onDetailsViewTabRemoved(tabId);

        interpreterMock.verifyAll();
        mockBroadcasterStrictMock.verifyAll();
        expect(tabInterpreterMap[tabId]).toBeDefined();
    });

    test('createTabContextAndTriggerTabUpdateForExistingTabs', () => {
        const openTabIds = [1, 5];
        const tabIdToTabContextStub = {};
        const mockInterpreters = [];
        const getTabCallbackMap: DictionaryStringTo<(tab: chrome.tabs.Tab) => void> = {};

        let tabsQueryCallback: (tabs: chrome.tabs.Tab[]) => void = null;
        const tabs: DictionaryStringTo<chrome.tabs.Tab> = {
            1: { id: openTabIds[0] } as chrome.tabs.Tab,
            5: { id: openTabIds[1] } as chrome.tabs.Tab,
        };

        openTabIds.forEach((tabId, index) => {
            const interpretInput: Message = {
                type: Messages.Tab.Update,
                payload: tabs[tabId],
                tabId: tabId,
            };

            const interpreterMock = Mock.ofType(Interpreter);
            interpreterMock.setup(im => im.interpret(It.isValue(interpretInput))).verifiable(Times.once());

            const broadCastDelegate = () => {};
            mockBroadcasterStrictMock
                .setup(mb => mb.getBroadcastMessageDelegate(tabId))
                .returns(() => broadCastDelegate)
                .verifiable(Times.once());

            tabIdToTabContextStub[tabId] = {
                interpreter: interpreterMock.object,
            };

            setupCreateTabContextMock(broadCastDelegate, tabIdToTabContextStub[tabId], tabId);

            mockInterpreters.push(interpreterMock);
            mockChromeAdapter
                .setup(mca => mca.getTab(It.isValue(tabId), It.isAny(), It.isAny()))
                .returns((id, cb) => {
                    getTabCallbackMap[tabId] = cb;
                })
                .verifiable(Times.once());
        });

        mockChromeAdapter
            .setup(mca => mca.tabsQuery(It.isValue({}), It.isAny()))
            .callback((query, callback) => {
                tabsQueryCallback = callback;
            });

        testSubject.initialize();

        tabsQueryCallback(Object.keys(tabs).map(id => tabs[id]));

        openTabIds.forEach(tabId => {
            getTabCallbackMap[tabId](tabs[tabId]);
        });
        mockBroadcasterStrictMock.verifyAll();
        mockChromeAdapter.verifyAll();
        expect(Object.keys(tabInterpreterMap).length).toBe(openTabIds.length);
        openTabIds.forEach(tabId => {
            expect(tabInterpreterMap[tabId]).toEqual(tabIdToTabContextStub[tabId]);
        });
        mockInterpreters.forEach(interpreterMock => {
            interpreterMock.verifyAll();
        });
    });

    test('tab change test', () => {
        let tabUpdatedCallback: (details: chrome.webNavigation.WebNavigationFramedCallbackDetails) => void = null;
        let getTabCallback: (tab: chrome.tabs.Tab) => void;
        let onReject;
        const tabId = 1;
        const getTabCallbackInput = {
            title: 'new title',
            url: 'new url',
            id: tabId,
        };

        const interpretInput: Message = {
            type: Messages.Tab.Change,
            payload: getTabCallbackInput,
            tabId: tabId,
        };
        const interpreterMock = Mock.ofType(Interpreter);
        interpreterMock.setup(im => im.interpret(It.isValue(interpretInput))).verifiable(Times.once());
        tabInterpreterMap = {
            1: {
                interpreter: interpreterMock.object,
                stores: null,
            },
        };

        mockChromeAdapter
            .setup(ca => ca.addListenerToWebNavigationUpdated(It.isAny()))
            .callback(cb => {
                tabUpdatedCallback = cb;
            })
            .verifiable(Times.once());

        mockChromeAdapter
            .setup(mca => mca.getTab(It.isValue(tabId), It.isAny(), It.isAny()))
            .returns((id, cb, reject) => {
                getTabCallback = cb;
                onReject = reject;
            })
            .verifiable(Times.once());
        logMock.setup(log => log(`changed tab with Id ${tabId} not found`)).verifiable(Times.once());

        testSubject = createTabControllerWithoutFeatureFlag(tabInterpreterMap);
        testSubject.initialize();
        tabUpdatedCallback({ frameId: 0, tabId: tabId } as chrome.webNavigation.WebNavigationFramedCallbackDetails);
        getTabCallback(getTabCallbackInput as any);
        onReject();

        logMock.verifyAll();
        interpreterMock.verifyAll();
        mockChromeAdapter.verifyAll();
    });

    test('Windows Focus Change test', () => {
        const tabStub1 = {
            id: 1,
        };
        const tabStub2 = {
            id: 2,
        };
        const windowStub1 = {
            id: 1,
            state: 'normal',
        };
        const windowStub2 = {
            id: 2,
            state: 'minimized',
        };
        const windowsStub = [windowStub1, windowStub2];
        const getInfo: chrome.windows.GetInfo = {
            populate: false,
            windowTypes: ['normal', 'popup'],
        };
        const interpretInput1: Message = {
            type: Messages.Tab.VisibilityChange,
            payload: {
                hidden: false,
            },
            tabId: 1,
        };
        const interpretInput2: Message = {
            type: Messages.Tab.VisibilityChange,
            payload: {
                hidden: true,
            },
            tabId: 2,
        };

        mockChromeAdapter
            .setup(ca => ca.addListenerOnWindowsFocusChanged(It.isAny()))
            .callback(windowFocusChangedCallback => {
                windowFocusChangedCallback(-1);
            })
            .verifiable(Times.once());

        mockChromeAdapter
            .setup(ca => ca.getAllWindows(It.isValue(getInfo), It.isAny()))
            .callback((id, getAllWindowsCallback) => {
                getAllWindowsCallback(windowsStub as chrome.windows.Window[]);
            })
            .verifiable(Times.once());

        mockChromeAdapter
            .setup(ca => ca.getSelectedTabInWindow(windowStub1.id, It.isAny()))
            .callback((id, getSelectedTabInWindowCallback) => {
                getSelectedTabInWindowCallback(tabStub1 as chrome.tabs.Tab);
            })
            .verifiable(Times.once());

        mockChromeAdapter
            .setup(ca => ca.getSelectedTabInWindow(windowStub2.id, It.isAny()))
            .callback((id, getSelectedTabInWindowCallback) => {
                getSelectedTabInWindowCallback(tabStub2 as chrome.tabs.Tab);
            })
            .verifiable(Times.once());

        mockChromeAdapter
            .setup(ca => ca.getRuntimeLastError())
            .returns(() => null)
            .verifiable(Times.exactly(2));

        const interpreterMock = Mock.ofType(Interpreter);
        interpreterMock.setup(im => im.interpret(It.isValue(interpretInput1))).verifiable(Times.once());

        interpreterMock.setup(im => im.interpret(It.isValue(interpretInput2))).verifiable(Times.once());

        tabInterpreterMap = {
            1: {
                interpreter: interpreterMock.object,
                stores: null,
            },
            2: {
                interpreter: interpreterMock.object,
                stores: null,
            },
        };

        testSubject = createTabControllerWithoutFeatureFlag(tabInterpreterMap);
        testSubject.initialize();

        interpreterMock.verifyAll();
        mockChromeAdapter.verifyAll();
    });

    test('Windows Focus Change - do nothing for window closed', () => {
        const tabStub1 = {
            id: 1,
        };
        const tabStub2 = {
            id: 2,
        };
        const windowStub1 = {
            id: 1,
            state: 'normal',
        };
        const windowStub2 = {
            id: 2,
            state: 'minimized',
        };
        const windowsStub = [windowStub1, windowStub2];
        const getInfo: chrome.windows.GetInfo = {
            populate: false,
            windowTypes: ['normal', 'popup'],
        };
        const interpretInput1: Message = {
            type: Messages.Tab.VisibilityChange,
            payload: {
                hidden: false,
            },
            tabId: 1,
        };
        const interpretInput2: Message = {
            type: Messages.Tab.VisibilityChange,
            payload: {
                hidden: true,
            },
            tabId: 2,
        };

        mockChromeAdapter
            .setup(ca => ca.addListenerOnWindowsFocusChanged(It.isAny()))
            .callback(windowFocusChangedCallback => {
                windowFocusChangedCallback(-1);
            })
            .verifiable(Times.once());

        mockChromeAdapter
            .setup(ca => ca.getAllWindows(It.isValue(getInfo), It.isAny()))
            .callback((id, getAllWindowsCallback) => {
                getAllWindowsCallback(windowsStub as chrome.windows.Window[]);
            })
            .verifiable(Times.once());

        mockChromeAdapter
            .setup(ca => ca.getSelectedTabInWindow(windowStub1.id, It.isAny()))
            .callback((id, getSelectedTabInWindowCallback) => {
                getSelectedTabInWindowCallback(tabStub1 as chrome.tabs.Tab);
            })
            .verifiable(Times.once());

        mockChromeAdapter
            .setup(ca => ca.getSelectedTabInWindow(windowStub2.id, It.isAny()))
            .callback((id, getSelectedTabInWindowCallback) => {
                getSelectedTabInWindowCallback(tabStub2 as chrome.tabs.Tab);
            })
            .verifiable(Times.once());

        mockChromeAdapter.setup(ca => ca.getRuntimeLastError()).returns(() => new Error('window closed'));

        mockChromeAdapter.setup(ca => ca.getRuntimeLastError()).returns(() => null);

        const interpreterMock = Mock.ofType(Interpreter);

        // do nothing for closed window
        interpreterMock.setup(im => im.interpret(It.isValue(interpretInput1))).verifiable(Times.never());

        interpreterMock.setup(im => im.interpret(It.isValue(interpretInput2))).verifiable(Times.once());

        tabInterpreterMap = {
            1: {
                interpreter: interpreterMock.object,
                stores: null,
            },
            2: {
                interpreter: interpreterMock.object,
                stores: null,
            },
        };

        testSubject = createTabControllerWithoutFeatureFlag(tabInterpreterMap);
        testSubject.initialize();

        interpreterMock.verifyAll();
        mockChromeAdapter.verifyAll();
    });

    test('Tab Focus Change test', () => {
        const activeInfo = {
            tabId: 1,
            windowId: 1,
        };
        const query = {
            windowId: activeInfo.windowId,
        };
        const tabStub1 = {
            id: 1,
            active: true,
        };
        const tabStub2 = {
            id: 2,
            active: false,
        };
        const tabs = [tabStub1, tabStub2];
        const windowStub = {
            id: 1,
        };
        const interpretInput1: Message = {
            type: Messages.Tab.VisibilityChange,
            payload: {
                hidden: false,
            },
            tabId: 1,
        };
        const interpretInput2: Message = {
            type: Messages.Tab.VisibilityChange,
            payload: {
                hidden: true,
            },
            tabId: 2,
        };

        mockChromeAdapter
            .setup(ca => ca.addListenerToTabsOnActivated(It.isAny()))
            .callback(onTabActivatedCallback => {
                onTabActivatedCallback(activeInfo);
            })
            .verifiable(Times.once());

        mockChromeAdapter
            .setup(ca => ca.tabsQuery(It.isValue(query), It.isAny()))
            .callback((id, getAllTabsCallback) => {
                getAllTabsCallback(tabs as chrome.tabs.Tab[]);
            })
            .verifiable(Times.once());

        const interpreterMock = Mock.ofType(Interpreter);
        interpreterMock.setup(im => im.interpret(It.isValue(interpretInput1))).verifiable(Times.once());

        interpreterMock.setup(im => im.interpret(It.isValue(interpretInput2))).verifiable(Times.once());

        tabInterpreterMap = {
            1: {
                interpreter: interpreterMock.object,
                stores: null,
            },
            2: {
                interpreter: interpreterMock.object,
                stores: null,
            },
        };

        testSubject = createTabControllerWithoutFeatureFlag(tabInterpreterMap);
        testSubject.initialize();

        interpreterMock.verifyAll();
        mockChromeAdapter.verifyAll();
    });

    test('onUpdateTab', () => {
        mockChromeAdapter.setup(ca => ca.addListenerToTabsOnUpdated(It.isAny())).verifiable(Times.once());

        testSubject.initialize();

        mockChromeAdapter.verifyAll();
    });
});
