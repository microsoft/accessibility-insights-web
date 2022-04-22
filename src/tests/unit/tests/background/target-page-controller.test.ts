// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    BrowserMessageBroadcasterFactory,
    MessageBroadcaster,
} from 'background/browser-message-broadcaster-factory';
import { ExtensionDetailsViewController } from 'background/extension-details-view-controller';
import { Interpreter } from 'background/interpreter';
import { TabContext } from 'background/tab-context';
import { TabContextFactory } from 'background/tab-context-factory';
import { TargetPageController } from 'background/target-page-controller';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Logger } from 'common/logging/logger';
import { Messages } from 'common/messages';
import { isFunction, values } from 'lodash';
import { flushSettledPromises } from 'tests/common/flush-settled-promises';
import {
    createSimulatedBrowserAdapter,
    SimulatedBrowserAdapter,
} from 'tests/unit/common/simulated-browser-adapter';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { DictionaryNumberTo } from 'types/common-types';

describe('TargetPageController', () => {
    let testSubject: TargetPageController;

    let mockLogger: IMock<Logger>;
    let mockBroadcasterFactoryStrictMock: IMock<BrowserMessageBroadcasterFactory>;
    let mockTabContextFactory: IMock<TabContextFactory>;
    let mockBrowserAdapter: SimulatedBrowserAdapter;
    let mockDetailsViewController: SimulatedDetailsViewController;
    let tabToContextMap: DictionaryNumberTo<TabContext>;
    let mockTabInterpreters: DictionaryNumberTo<IMock<Interpreter>>;
    let knownTabIds: number[];
    const indexedDBDataKey: string = 'knownTabIds';
    const idbInstanceMock: IMock<IndexedDBAPI> = Mock.ofType<IndexedDBAPI>();
    let tabContextTeardownMock: IMock<() => Promise<void>>;

    const EXISTING_WINDOW_ID = 101;
    const EXISTING_WINDOW = { id: EXISTING_WINDOW_ID } as chrome.windows.Window;

    const EXISTING_ACTIVE_TAB_ID = 1;
    const EXISTING_ACTIVE_TAB = {
        id: EXISTING_ACTIVE_TAB_ID,
        windowId: EXISTING_WINDOW_ID,
        active: true,
    } as chrome.tabs.Tab;

    const EXISTING_INACTIVE_TAB_ID = 2;
    const EXISTING_INACTIVE_TAB = {
        id: EXISTING_INACTIVE_TAB_ID,
        windowId: EXISTING_WINDOW_ID,
        active: false,
    } as chrome.tabs.Tab;

    const NEW_TAB_ID = 3;
    const NEW_TAB = {
        id: NEW_TAB_ID,
        windowId: EXISTING_WINDOW_ID,
        active: true,
    } as chrome.tabs.Tab;

    beforeEach(() => {
        mockLogger = Mock.ofType<Logger>();
        mockBroadcasterFactoryStrictMock = Mock.ofType<BrowserMessageBroadcasterFactory>(
            undefined,
            MockBehavior.Strict,
        );
        mockBroadcasterFactoryStrictMock
            .setup(m => m.createTabSpecificBroadcaster(It.isAny()))
            .returns(tabId => fakeBroadcasterForTabId(tabId));
        mockBrowserAdapter = createSimulatedBrowserAdapter(
            [EXISTING_ACTIVE_TAB, EXISTING_INACTIVE_TAB],
            [EXISTING_WINDOW],
        );
        mockDetailsViewController = setupMockDetailsViewController();
        tabToContextMap = {};
        mockTabInterpreters = {};
        mockTabInterpreters[EXISTING_ACTIVE_TAB_ID] = Mock.ofType<Interpreter>();
        mockTabInterpreters[EXISTING_INACTIVE_TAB_ID] = Mock.ofType<Interpreter>();
        mockTabInterpreters[NEW_TAB_ID] = Mock.ofType<Interpreter>();
        mockTabContextFactory = setupMockTabContextFactory(mockTabInterpreters);
        idbInstanceMock.reset();
        knownTabIds = [];
        tabContextTeardownMock = Mock.ofInstance(() => Promise.resolve());

        testSubject = new TargetPageController(
            tabToContextMap,
            mockBroadcasterFactoryStrictMock.object,
            mockBrowserAdapter.object,
            mockDetailsViewController.object,
            mockTabContextFactory.object,
            mockLogger.object,
            knownTabIds,
            idbInstanceMock.object,
        );
    });

    describe('initialize', () => {
        it('should register the expected listeners', async () => {
            setupDatabaseInstance([EXISTING_ACTIVE_TAB_ID], Times.once());
            setupDatabaseInstance([EXISTING_ACTIVE_TAB_ID, EXISTING_INACTIVE_TAB_ID], Times.once());
            setupTeardownInstance(Times.never());

            await testSubject.initialize();

            mockBrowserAdapter.verify(m => m.addListenerOnConnect(It.isAny()), Times.once());
            mockBrowserAdapter.verify(
                m => m.addListenerOnWindowsFocusChanged(It.isAny()),
                Times.once(),
            );
            mockBrowserAdapter.verify(
                m => m.addListenerToTabsOnActivated(It.isAny()),
                Times.once(),
            );
            mockBrowserAdapter.verify(m => m.addListenerToTabsOnRemoved(It.isAny()), Times.once());
            mockBrowserAdapter.verify(m => m.addListenerToTabsOnUpdated(It.isAny()), Times.once());
            mockBrowserAdapter.verify(
                m => m.addListenerToWebNavigationUpdated(It.isAny()),
                Times.once(),
            );

            mockDetailsViewController.verify(
                m => m.setupDetailsViewTabRemovedHandler(It.isAny()),
                Times.once(),
            );

            idbInstanceMock.verifyAll();
        });

        it('should create a tab context for each pre-existing tab', async () => {
            setupDatabaseInstance([EXISTING_ACTIVE_TAB_ID], Times.once());
            setupDatabaseInstance([EXISTING_ACTIVE_TAB_ID, EXISTING_INACTIVE_TAB_ID], Times.once());

            await testSubject.initialize();

            mockTabContextFactory.verify(
                f =>
                    f.createTabContext(
                        itIsFakeBroadcasterForTabId(EXISTING_ACTIVE_TAB_ID),
                        It.isAny(),
                        It.isAny(),
                        EXISTING_ACTIVE_TAB_ID,
                    ),
                Times.once(),
            );
            expect(tabToContextMap[EXISTING_ACTIVE_TAB_ID]).toHaveProperty(
                'interpreter',
                mockTabInterpreters[EXISTING_ACTIVE_TAB_ID].object,
            );

            mockTabContextFactory.verify(
                f =>
                    f.createTabContext(
                        itIsFakeBroadcasterForTabId(EXISTING_INACTIVE_TAB_ID),
                        It.isAny(),
                        It.isAny(),
                        EXISTING_INACTIVE_TAB_ID,
                    ),
                Times.once(),
            );
            expect(tabToContextMap[EXISTING_INACTIVE_TAB_ID]).toHaveProperty(
                'interpreter',
                mockTabInterpreters[EXISTING_INACTIVE_TAB_ID].object,
            );

            mockTabContextFactory.verify(
                f =>
                    f.createTabContext(
                        itIsFakeBroadcasterForTabId(NEW_TAB_ID),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                    ),
                Times.never(),
            );
            expect(tabToContextMap[NEW_TAB_ID]).toBeUndefined();

            idbInstanceMock.verifyAll();
        });

        it('should create a tab context for each persisted tab', async () => {
            setupDatabaseInstance(null, Times.never());

            knownTabIds.push(EXISTING_INACTIVE_TAB_ID);
            knownTabIds.push(EXISTING_ACTIVE_TAB_ID);

            await testSubject.initialize();

            mockTabContextFactory.verify(
                f =>
                    f.createTabContext(
                        itIsFakeBroadcasterForTabId(EXISTING_ACTIVE_TAB_ID),
                        It.isAny(),
                        It.isAny(),
                        EXISTING_ACTIVE_TAB_ID,
                    ),
                Times.once(),
            );
            expect(tabToContextMap[EXISTING_ACTIVE_TAB_ID]).toHaveProperty(
                'interpreter',
                mockTabInterpreters[EXISTING_ACTIVE_TAB_ID].object,
            );

            mockTabContextFactory.verify(
                f =>
                    f.createTabContext(
                        itIsFakeBroadcasterForTabId(EXISTING_INACTIVE_TAB_ID),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                    ),
                Times.once(),
            );
            expect(tabToContextMap[EXISTING_INACTIVE_TAB_ID]).toHaveProperty(
                'interpreter',
                mockTabInterpreters[EXISTING_INACTIVE_TAB_ID].object,
            );

            mockTabContextFactory.verify(
                f =>
                    f.createTabContext(
                        itIsFakeBroadcasterForTabId(NEW_TAB_ID),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                    ),
                Times.never(),
            );
            expect(tabToContextMap[NEW_TAB_ID]).toBeUndefined();

            idbInstanceMock.verifyAll();

            verifyNoInterpreterMessages(mockTabInterpreters);
        });

        it('should create a tab context for each persisted and non-persisted tab', async () => {
            setupDatabaseInstance([EXISTING_ACTIVE_TAB_ID, EXISTING_INACTIVE_TAB_ID], Times.once());

            knownTabIds.push(EXISTING_ACTIVE_TAB_ID);

            await testSubject.initialize();

            mockTabContextFactory.verify(
                f =>
                    f.createTabContext(
                        itIsFakeBroadcasterForTabId(EXISTING_ACTIVE_TAB_ID),
                        It.isAny(),
                        It.isAny(),
                        EXISTING_ACTIVE_TAB_ID,
                    ),
                Times.once(),
            );
            expect(tabToContextMap[EXISTING_ACTIVE_TAB_ID]).toHaveProperty(
                'interpreter',
                mockTabInterpreters[EXISTING_ACTIVE_TAB_ID].object,
            );

            mockTabContextFactory.verify(
                f =>
                    f.createTabContext(
                        itIsFakeBroadcasterForTabId(EXISTING_INACTIVE_TAB_ID),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                    ),
                Times.once(),
            );
            expect(tabToContextMap[EXISTING_INACTIVE_TAB_ID]).toHaveProperty(
                'interpreter',
                mockTabInterpreters[EXISTING_INACTIVE_TAB_ID].object,
            );

            mockTabContextFactory.verify(
                f =>
                    f.createTabContext(
                        itIsFakeBroadcasterForTabId(NEW_TAB_ID),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                    ),
                Times.never(),
            );
            expect(tabToContextMap[NEW_TAB_ID]).toBeUndefined();

            idbInstanceMock.verifyAll();

            mockTabInterpreters[EXISTING_ACTIVE_TAB_ID].verify(
                i => i.interpret(It.isAny()),
                Times.never(),
            );
            mockTabInterpreters[EXISTING_INACTIVE_TAB_ID].verify(
                i => i.interpret(It.isAny()),
                Times.once(),
            );
        });

        it('should remove tabs that no longer exist', async () => {
            setupDatabaseInstance([EXISTING_ACTIVE_TAB_ID, EXISTING_INACTIVE_TAB_ID], Times.once());
            setupTeardownInstance(Times.once());

            knownTabIds.push(EXISTING_ACTIVE_TAB_ID, EXISTING_INACTIVE_TAB_ID, NEW_TAB_ID);

            await testSubject.initialize();

            mockTabContextFactory.verify(
                f =>
                    f.createTabContext(
                        itIsFakeBroadcasterForTabId(EXISTING_ACTIVE_TAB_ID),
                        It.isAny(),
                        It.isAny(),
                        EXISTING_ACTIVE_TAB_ID,
                    ),
                Times.once(),
            );
            expect(tabToContextMap[EXISTING_ACTIVE_TAB_ID]).toHaveProperty(
                'interpreter',
                mockTabInterpreters[EXISTING_ACTIVE_TAB_ID].object,
            );

            mockTabContextFactory.verify(
                f =>
                    f.createTabContext(
                        itIsFakeBroadcasterForTabId(EXISTING_INACTIVE_TAB_ID),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                    ),
                Times.once(),
            );
            expect(tabToContextMap[EXISTING_INACTIVE_TAB_ID]).toHaveProperty(
                'interpreter',
                mockTabInterpreters[EXISTING_INACTIVE_TAB_ID].object,
            );

            mockTabContextFactory.verify(
                f =>
                    f.createTabContext(
                        itIsFakeBroadcasterForTabId(NEW_TAB_ID),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                    ),
                Times.once(),
            );
            expect(tabToContextMap[NEW_TAB_ID]).toBeUndefined();

            idbInstanceMock.verifyAll();

            mockTabInterpreters[EXISTING_ACTIVE_TAB_ID].verify(
                i => i.interpret(It.isAny()),
                Times.never(),
            );
            mockTabInterpreters[EXISTING_INACTIVE_TAB_ID].verify(
                i => i.interpret(It.isAny()),
                Times.never(),
            );

            const expectedMessage = {
                messageType: Messages.Tab.Remove,
                payload: null,
                tabId: NEW_TAB_ID,
            };
            mockTabInterpreters[NEW_TAB_ID].verify(i => i.interpret(expectedMessage), Times.once());
        });
    });

    describe('in initialized state', () => {
        beforeEach(async () => {
            await testSubject.initialize();
            idbInstanceMock.reset();
            resetInterpreterMocks(mockTabInterpreters);
        });

        afterEach(() => {
            idbInstanceMock.verifyAll();
        });

        describe('onConnect', () => {
            it('should not have any observable effect', () => {
                setupDatabaseInstance(null, Times.never());

                mockBrowserAdapter.notifyOnConnect({
                    name: 'irrelevant port',
                } as chrome.runtime.Port);
                verifyNoInterpreterMessages(mockTabInterpreters);
            });
        });

        describe('onWebNavigationUpdated', () => {
            const rootFrameId = 0;
            const nonRootFrameId = 1;

            it('should ignore updates for non-root frames', () => {
                setupDatabaseInstance(null, Times.never());
                setupTeardownInstance(Times.never());

                mockBrowserAdapter.notifyWebNavigationUpdated({
                    frameId: nonRootFrameId,
                    tabId: EXISTING_ACTIVE_TAB_ID,
                } as chrome.webNavigation.WebNavigationFramedCallbackDetails);

                verifyNoInterpreterMessages(mockTabInterpreters);
            });

            it('should initialize a new tab context for root frames in new tabs', () => {
                setupDatabaseInstance(
                    [EXISTING_ACTIVE_TAB_ID, EXISTING_INACTIVE_TAB_ID, NEW_TAB_ID],
                    Times.once(),
                );

                mockBrowserAdapter.notifyWebNavigationUpdated({
                    frameId: rootFrameId,
                    tabId: NEW_TAB_ID,
                } as chrome.webNavigation.WebNavigationFramedCallbackDetails);

                mockTabContextFactory.verify(
                    f =>
                        f.createTabContext(
                            itIsFakeBroadcasterForTabId(NEW_TAB_ID),
                            It.isAny(),
                            It.isAny(),
                            NEW_TAB_ID,
                        ),
                    Times.once(),
                );
                expect(tabToContextMap[NEW_TAB_ID]).toHaveProperty(
                    'interpreter',
                    mockTabInterpreters[NEW_TAB_ID].object,
                );
            });

            it('should send an Tab.ExistingTabUpdated message for root frames in existing tabs', () => {
                setupDatabaseInstance(null, Times.never());

                mockBrowserAdapter.notifyWebNavigationUpdated({
                    frameId: rootFrameId,
                    tabId: EXISTING_ACTIVE_TAB_ID,
                } as chrome.webNavigation.WebNavigationFramedCallbackDetails);

                const expectedMessage = {
                    messageType: Messages.Tab.ExistingTabUpdated,
                    payload: { ...EXISTING_ACTIVE_TAB },
                    tabId: EXISTING_ACTIVE_TAB_ID,
                };
                mockTabInterpreters[EXISTING_ACTIVE_TAB_ID].verify(
                    i => i.interpret(expectedMessage),
                    Times.once(),
                );
            });
        });

        describe('onTabRemoved', () => {
            it('should ignore removals of non-tracked tabs', () => {
                setupDatabaseInstance(null, Times.never());
                setupTeardownInstance(Times.once());
                mockBrowserAdapter.notifyTabsOnRemoved(NEW_TAB_ID, null);
                verifyNoInterpreterMessages(mockTabInterpreters);
            });

            it('should send a Tab.Remove message for tracked tabs', () => {
                setupDatabaseInstance([EXISTING_INACTIVE_TAB_ID], Times.once());
                setupTeardownInstance(Times.once());

                const expectedMessage = {
                    messageType: Messages.Tab.Remove,
                    payload: null,
                    tabId: EXISTING_ACTIVE_TAB_ID,
                };
                mockBrowserAdapter.notifyTabsOnRemoved(EXISTING_ACTIVE_TAB_ID, null);
                mockTabInterpreters[EXISTING_ACTIVE_TAB_ID].verify(
                    i => i.interpret(expectedMessage),
                    Times.once(),
                );
            });

            it('should remove tabToContextMap entries for tabs that are removed', () => {
                setupDatabaseInstance([EXISTING_INACTIVE_TAB_ID], Times.once());
                setupTeardownInstance(Times.once());

                mockBrowserAdapter.notifyTabsOnRemoved(EXISTING_ACTIVE_TAB_ID, null);

                expect(tabToContextMap[EXISTING_ACTIVE_TAB_ID]).toBeUndefined();
            });

            it('should stop sending future messages after tabs are removed', () => {
                setupDatabaseInstance([EXISTING_INACTIVE_TAB_ID], Times.once());
                setupTeardownInstance(Times.once());

                mockBrowserAdapter.notifyTabsOnRemoved(EXISTING_ACTIVE_TAB_ID, null);
                resetInterpreterMocks(mockTabInterpreters);
                mockBrowserAdapter.notifyTabsOnRemoved(EXISTING_ACTIVE_TAB_ID, null);

                verifyNoInterpreterMessages(mockTabInterpreters);
            });
        });

        describe('onDetailsViewTabRemoved', () => {
            beforeEach(() => {
                setupDatabaseInstance(null, Times.never());
                setupTeardownInstance(Times.never());
            });

            it('should ignore removals of non-tracked tabs', () => {
                mockDetailsViewController.notifyDetailsViewTabRemoved(NEW_TAB_ID);
                verifyNoInterpreterMessages(mockTabInterpreters);
            });

            it('should send a Messages.Visualizations.DetailsView.Close message for tracked tabs', () => {
                mockDetailsViewController.notifyDetailsViewTabRemoved(EXISTING_ACTIVE_TAB_ID);

                const expectedMessage = {
                    messageType: Messages.Visualizations.DetailsView.Close,
                    payload: null,
                    tabId: EXISTING_ACTIVE_TAB_ID,
                };
                mockTabInterpreters[EXISTING_ACTIVE_TAB_ID].verify(
                    i => i.interpret(expectedMessage),
                    Times.once(),
                );
            });
        });

        describe('onWindowsFocusChanged', () => {
            beforeEach(() => {
                setupDatabaseInstance(null, Times.never());
                setupTeardownInstance(Times.never());
            });

            const irrelevantWindowId = -1;
            it.each`
                windowState       | expectedHiddenValue
                ${'minimized'}    | ${true}
                ${'maximized'}    | ${false}
                ${'normal'}       | ${false}
                ${'unrecognized'} | ${false}
            `(
                'should send a Tab.VisibilityChange message with hidden=$expectedHiddenValue for active tabs in windows with state $windowState',
                async ({ windowState, expectedHiddenValue }) => {
                    mockBrowserAdapter.windows.forEach(w => {
                        w.state = windowState;
                    });
                    mockBrowserAdapter.notifyWindowsFocusChanged(irrelevantWindowId);

                    await flushSettledPromises();

                    const expectedMessage = {
                        messageType: Messages.Tab.VisibilityChange,
                        payload: { hidden: expectedHiddenValue },
                        tabId: EXISTING_ACTIVE_TAB_ID,
                    };
                    mockTabInterpreters[EXISTING_ACTIVE_TAB_ID].verify(
                        i => i.interpret(expectedMessage),
                        Times.once(),
                    );
                },
            );

            it('should ignore untracked tabs', () => {
                mockBrowserAdapter.notifyWindowsFocusChanged(irrelevantWindowId);
                mockTabInterpreters[NEW_TAB_ID].verify(i => i.interpret(It.isAny()), Times.never());
            });

            it('should ignore inactive tabs', () => {
                mockBrowserAdapter.notifyWindowsFocusChanged(irrelevantWindowId);
                mockTabInterpreters[EXISTING_INACTIVE_TAB_ID].verify(
                    i => i.interpret(It.isAny()),
                    Times.never(),
                );
            });

            it('should ignore tabs for windows which result in a runtime error when queried', () => {
                mockBrowserAdapter.object.getRuntimeLastError(); // clear out the first method setup from setupMockBrowserAdapter()
                mockBrowserAdapter
                    .setup(m => m.getRuntimeLastError())
                    .returns(() => ({ message: 'test error' }));

                mockBrowserAdapter.notifyWindowsFocusChanged(irrelevantWindowId);
                verifyNoInterpreterMessages(mockTabInterpreters);
            });
        });

        describe('onTabActivated', () => {
            beforeEach(() => {
                setupDatabaseInstance(null, Times.never());
            });

            it('should send a Tab.VisibilityChange message with isHidden=false for activation of known tabs', () => {
                mockBrowserAdapter.activateTab(EXISTING_INACTIVE_TAB);

                const expectedMessage = {
                    messageType: Messages.Tab.VisibilityChange,
                    payload: { hidden: false },
                    tabId: EXISTING_INACTIVE_TAB_ID,
                };
                mockTabInterpreters[EXISTING_INACTIVE_TAB_ID].verify(
                    i => i.interpret(expectedMessage),
                    Times.once(),
                );
            });

            it('should send a Tab.VisibilityChange message with isHidden=true for other known tabs in the same window when a known tab is activated', async () => {
                mockBrowserAdapter.activateTab(EXISTING_INACTIVE_TAB);
                await flushSettledPromises();

                const expectedMessage = {
                    messageType: Messages.Tab.VisibilityChange,
                    payload: { hidden: true },
                    tabId: EXISTING_ACTIVE_TAB_ID,
                };
                mockTabInterpreters[EXISTING_ACTIVE_TAB_ID].verify(
                    i => i.interpret(expectedMessage),
                    Times.once(),
                );
            });

            it('should send a Tab.VisibilityChange message with isHidden=true for other known tabs in the same window when an untracked tab is activated', async () => {
                mockBrowserAdapter.activateTab(NEW_TAB);
                await flushSettledPromises();

                const expectedMessage = {
                    messageType: Messages.Tab.VisibilityChange,
                    payload: { hidden: true },
                    tabId: EXISTING_ACTIVE_TAB_ID,
                };
                mockTabInterpreters[EXISTING_ACTIVE_TAB_ID].verify(
                    i => i.interpret(expectedMessage),
                    Times.once(),
                );
            });

            it('should not send activation messages for untracked tabs', () => {
                mockBrowserAdapter.tabs.push(NEW_TAB);
                mockBrowserAdapter.activateTab(NEW_TAB);
                mockTabInterpreters[NEW_TAB_ID].verify(i => i.interpret(It.isAny()), Times.never());
            });

            it('should not send deactivation messages for untracked tabs', () => {
                mockBrowserAdapter.tabs.push(NEW_TAB);
                mockBrowserAdapter.activateTab(EXISTING_INACTIVE_TAB);
                mockTabInterpreters[NEW_TAB_ID].verify(i => i.interpret(It.isAny()), Times.never());
            });
        });

        describe('onTabUpdated', () => {
            const changeInfoWithoutUrl: chrome.tabs.TabChangeInfo = {};
            const changeInfoWithUrl: chrome.tabs.TabChangeInfo = {
                url: 'https://new-host/new-page',
            };

            it("should ignore updates that don't change the url", () => {
                setupDatabaseInstance(null, Times.never());
                mockBrowserAdapter.updateTab(EXISTING_ACTIVE_TAB_ID, changeInfoWithoutUrl);
                verifyNoInterpreterMessages(mockTabInterpreters);
            });

            it('should initialize a new tab context for url changes in untracked tabs', () => {
                setupDatabaseInstance(
                    [EXISTING_ACTIVE_TAB_ID, EXISTING_INACTIVE_TAB_ID, NEW_TAB_ID],
                    Times.once(),
                );
                mockBrowserAdapter.tabs.push(NEW_TAB);
                mockBrowserAdapter.updateTab(NEW_TAB_ID, changeInfoWithUrl);

                mockTabContextFactory.verify(
                    f =>
                        f.createTabContext(
                            itIsFakeBroadcasterForTabId(NEW_TAB_ID),
                            It.isAny(),
                            It.isAny(),
                            NEW_TAB_ID,
                        ),
                    Times.once(),
                );
                expect(tabToContextMap[NEW_TAB_ID]).toHaveProperty(
                    'interpreter',
                    mockTabInterpreters[NEW_TAB_ID].object,
                );
            });

            it('should send a Tab.ExistingTabUpdated message for url changes in tracked tabs', () => {
                setupDatabaseInstance(null, Times.never());
                const expectedMessage = {
                    messageType: Messages.Tab.ExistingTabUpdated,
                    payload: {
                        ...EXISTING_ACTIVE_TAB,
                        url: changeInfoWithUrl.url,
                    },
                    tabId: EXISTING_ACTIVE_TAB_ID,
                };
                mockBrowserAdapter.updateTab(EXISTING_ACTIVE_TAB_ID, changeInfoWithUrl);

                mockTabInterpreters[EXISTING_ACTIVE_TAB_ID].verify(
                    i => i.interpret(expectedMessage),
                    Times.once(),
                );
            });
        });
    });

    function resetInterpreterMocks(interpreters: DictionaryNumberTo<IMock<Interpreter>>): void {
        for (const interpreter of values(interpreters)) {
            interpreter.reset();
        }
    }

    function verifyNoInterpreterMessages(
        interpreters: DictionaryNumberTo<IMock<Interpreter>>,
    ): void {
        for (const interpreter of values(interpreters)) {
            interpreter.verify(i => i.interpret(It.isAny()), Times.never());
        }
    }

    type SimulatedDetailsViewController = IMock<ExtensionDetailsViewController> & {
        notifyDetailsViewTabRemoved?: (tabId: number) => void;
    };

    function setupMockDetailsViewController(): SimulatedDetailsViewController {
        const mock: SimulatedDetailsViewController = Mock.ofType<ExtensionDetailsViewController>();
        mock.setup(m => m.setupDetailsViewTabRemovedHandler(It.is(isFunction))).callback(
            c => (mock.notifyDetailsViewTabRemoved = c),
        );
        return mock;
    }

    const fakeBroadcasterForTabId = (tabId: number): MessageBroadcaster => {
        const fake = (message: any) => Promise.resolve();
        fake.tabId = tabId;
        return fake;
    };

    const itIsFakeBroadcasterForTabId = (tabId: number): MessageBroadcaster => {
        return It.is<MessageBroadcaster>(object => object['tabId'] === tabId);
    };

    function setupMockTabContextFactory(
        interpreters: DictionaryNumberTo<IMock<Interpreter>>,
    ): IMock<TabContextFactory> {
        const mock = Mock.ofType(TabContextFactory);
        mock.setup(m =>
            m.createTabContext(
                It.isAny(),
                mockBrowserAdapter.object,
                mockDetailsViewController.object,
                It.isAny(),
            ),
        ).returns((fakeBroadcaster, _2, _3) => ({
            stores: null,
            interpreter: interpreters[fakeBroadcaster.tabId].object,
            teardown: tabContextTeardownMock.object,
        }));
        return mock;
    }

    const setupDatabaseInstance = (expectedList: number[], times: Times) => {
        if (expectedList) {
            idbInstanceMock
                .setup(db => db.setItem(indexedDBDataKey, expectedList))
                .returns(() => Promise.resolve(true))
                .verifiable(times);
        } else {
            idbInstanceMock.setup(db => db.setItem(indexedDBDataKey, It.isAny())).verifiable(times);
        }
    };

    const setupTeardownInstance = (times: Times) => {
        tabContextTeardownMock
            .setup(teardown => teardown())
            .returns(() => Promise.resolve())
            .verifiable(times);
    };
});
