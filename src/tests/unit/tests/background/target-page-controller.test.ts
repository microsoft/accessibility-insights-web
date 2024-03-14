// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TabContextFactory } from 'background/tab-context-factory';
import { TabContextManager } from 'background/tab-context-manager';
import { TargetPageController } from 'background/target-page-controller';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { InterpreterMessage } from 'common/message';
import { Messages } from 'common/messages';
import { flushSettledPromises } from 'tests/common/flush-settled-promises';
import {
    createSimulatedBrowserAdapter,
    SimulatedBrowserAdapter,
} from 'tests/unit/common/simulated-browser-adapter';
import { IMock, It, Mock, Times } from 'typemoq';
import { DictionaryNumberTo } from 'types/common-types';
import type { Tabs } from 'webextension-polyfill';

describe('TargetPageController', () => {
    let testSubject: TargetPageController;

    let mockBrowserAdapter: SimulatedBrowserAdapter;
    let knownTabIds: DictionaryNumberTo<string>;
    let mockTabContextFactory: IMock<TabContextFactory>;
    let mockTabContextManager: IMock<TabContextManager>;
    const indexedDBDataKey: string = 'knownTabIds';
    const idbInstanceMock: IMock<IndexedDBAPI> = Mock.ofType<IndexedDBAPI>();

    const EXISTING_WINDOW_ID = 101;
    const EXISTING_WINDOW = { id: EXISTING_WINDOW_ID } as chrome.windows.Window;

    const EXISTING_ACTIVE_TAB_ID = 1;
    const EXISTING_ACTIVE_TAB = {
        id: EXISTING_ACTIVE_TAB_ID,
        windowId: EXISTING_WINDOW_ID,
        active: true,
    } as Tabs.Tab;

    const EXISTING_INACTIVE_TAB_ID = 2;
    const EXISTING_INACTIVE_TAB = {
        id: EXISTING_INACTIVE_TAB_ID,
        windowId: EXISTING_WINDOW_ID,
        active: false,
    } as Tabs.Tab;

    const NEW_TAB_ID = 3;
    const NEW_TAB = {
        id: NEW_TAB_ID,
        windowId: EXISTING_WINDOW_ID,
        active: true,
    } as Tabs.Tab;

    beforeEach(() => {
        mockBrowserAdapter = createSimulatedBrowserAdapter(
            [EXISTING_ACTIVE_TAB, EXISTING_INACTIVE_TAB],
            [EXISTING_WINDOW],
        );
        mockTabContextFactory = Mock.ofType<TabContextFactory>();
        mockTabContextManager = Mock.ofType<TabContextManager>();
        mockTabContextManager
            .setup(m => m.interpretMessageForTab(It.isAny(), It.isAny()))
            .returns(() => ({ messageHandled: true, result: undefined }));
        idbInstanceMock.reset();
        knownTabIds = {};
    });

    beforeEach(() => {
        testSubject = new TargetPageController(
            mockTabContextManager.object,
            mockTabContextFactory.object,
            mockBrowserAdapter.object,
            knownTabIds,
            idbInstanceMock.object,
        );
    });

    afterEach(() => {
        mockTabContextManager.verifyAll();
        mockTabContextFactory.verifyAll();
        idbInstanceMock.verifyAll();
    });

    describe('initialize', () => {
        beforeEach(() => {
            idbInstanceMock.reset();
        });

        it('should persist the expected tabs', async () => {
            setupDatabaseInstance(Times.once(), [EXISTING_ACTIVE_TAB_ID]);
            setupDatabaseInstance(Times.once(), [EXISTING_ACTIVE_TAB_ID, EXISTING_INACTIVE_TAB_ID]);
            setupNeverDeleteTabs();

            await testSubject.initialize();
        });

        it('should create a tab context for each pre-existing tab', async () => {
            setupDatabaseInstance(Times.once(), [EXISTING_ACTIVE_TAB_ID]);
            setupDatabaseInstance(Times.once(), [EXISTING_ACTIVE_TAB_ID, EXISTING_INACTIVE_TAB_ID]);

            setupTryCreateTabContexts([EXISTING_ACTIVE_TAB_ID, EXISTING_INACTIVE_TAB_ID]);
            setupNeverCreateTabContexts([NEW_TAB_ID]);

            await testSubject.initialize();
        });

        it('should create a tab context for each persisted tab', async () => {
            setupDatabaseInstance(Times.never());

            knownTabIds[EXISTING_INACTIVE_TAB_ID] = undefined;
            knownTabIds[EXISTING_ACTIVE_TAB_ID] = undefined;

            setupTryCreateTabContexts([EXISTING_ACTIVE_TAB_ID, EXISTING_INACTIVE_TAB_ID]);
            setupNeverCreateTabContexts([NEW_TAB_ID]);
            setupNeverInterpretMessage();

            await testSubject.initialize();
        });

        it('should create a tab context for each persisted and non-persisted tab', async () => {
            knownTabIds[EXISTING_ACTIVE_TAB_ID] = undefined;

            setupDatabaseInstance(Times.once(), null, {
                1: undefined,
                2: '',
            });

            setupTryCreateTabContexts([EXISTING_ACTIVE_TAB_ID, EXISTING_INACTIVE_TAB_ID]);
            setupNeverCreateTabContexts([NEW_TAB_ID]);
            setupNeverInterpretMessage(EXISTING_ACTIVE_TAB_ID);
            setupInterpretMessageForTab(EXISTING_INACTIVE_TAB_ID);

            await testSubject.initialize();
        });

        it('should treat known tabs with a changed url and no details view as new', async () => {
            knownTabIds[EXISTING_ACTIVE_TAB_ID] = 'url';

            // The browser adapter always returns '' for the url, so the database should be updated to reflect this 'updated' url
            setupDatabaseInstance(Times.once(), null, {
                1: '',
                2: '',
            });

            setupTryCreateTabContexts([EXISTING_ACTIVE_TAB_ID, EXISTING_INACTIVE_TAB_ID]);
            setupNeverCreateTabContexts([NEW_TAB_ID]);
            const expectedMessage = {
                messageType: Messages.Tab.ExistingTabUpdated,
                payload: { ...EXISTING_ACTIVE_TAB },
                tabId: EXISTING_ACTIVE_TAB_ID,
            };
            mockTabContextManager
                .setup(m => m.interpretMessageForTab(EXISTING_ACTIVE_TAB_ID, expectedMessage))
                .returns(() => ({ messageHandled: true, result: undefined }))
                .verifiable();

            await testSubject.initialize();
        });

        describe('in initialized state', () => {
            beforeEach(async () => {
                await testSubject.initialize();
                idbInstanceMock.reset();
                mockTabContextManager.reset();
            });

            describe('onWebNavigationUpdated', () => {
                const rootFrameId = 0;
                const nonRootFrameId = 1;

                beforeEach(() => {
                    idbInstanceMock.reset();
                });

                it('should ignore updates for non-root frames', async () => {
                    setupDatabaseInstance(Times.never());
                    setupNeverDeleteTabs();
                    setupNeverInterpretMessage();

                    await testSubject.onTabNavigated({
                        frameId: nonRootFrameId,
                        tabId: EXISTING_ACTIVE_TAB_ID,
                    } as chrome.webNavigation.WebNavigationFramedCallbackDetails);
                });

                it('should initialize tab context for root frames in new tabs', async () => {
                    setupDatabaseInstance(Times.once(), [
                        EXISTING_ACTIVE_TAB_ID,
                        EXISTING_INACTIVE_TAB_ID,
                        NEW_TAB_ID,
                    ]);
                    setupTryCreateTabContexts([NEW_TAB_ID]);

                    await testSubject.onTabNavigated({
                        frameId: rootFrameId,
                        tabId: NEW_TAB_ID,
                    } as chrome.webNavigation.WebNavigationFramedCallbackDetails);
                });

                it('should initialize tab context and send Tab.ExistingTabUpdated for root frames in existing tabs', async () => {
                    setupDatabaseInstance(Times.never());
                    setupTryCreateTabContexts([EXISTING_ACTIVE_TAB_ID]);
                    setupInterpretMessageForTab(
                        EXISTING_ACTIVE_TAB_ID,
                        Messages.Tab.ExistingTabUpdated,
                        { ...EXISTING_ACTIVE_TAB },
                    );

                    await testSubject.onTabNavigated({
                        frameId: rootFrameId,
                        tabId: EXISTING_ACTIVE_TAB_ID,
                    } as chrome.webNavigation.WebNavigationFramedCallbackDetails);
                });
            });

            describe('onTabRemoved', () => {
                it('should try to send message and not update database on removals of non-tracked tabs', async () => {
                    setupDatabaseInstance(Times.never());
                    mockTabContextManager.setup(m => m.deleteTabContext(NEW_TAB_ID)).verifiable();
                    setupInterpretMessageForTab(NEW_TAB_ID, Messages.Tab.Remove);

                    await testSubject.onTargetTabRemoved(NEW_TAB_ID);
                });

                it('should send a Tab.Remove message and update database for tracked tabs', async () => {
                    setupDatabaseInstance(Times.once(), [EXISTING_INACTIVE_TAB_ID]);
                    mockTabContextManager
                        .setup(m => m.deleteTabContext(EXISTING_ACTIVE_TAB_ID))
                        .verifiable();
                    setupInterpretMessageForTab(EXISTING_ACTIVE_TAB_ID, Messages.Tab.Remove);

                    await testSubject.onTargetTabRemoved(EXISTING_ACTIVE_TAB_ID);
                });

                it('should remove tabToContextMap entries for tabs that are removed', async () => {
                    setupDatabaseInstance(Times.once(), [EXISTING_INACTIVE_TAB_ID]);
                    setupInterpretMessageForTab(EXISTING_ACTIVE_TAB_ID, Messages.Tab.Remove);
                    mockTabContextManager
                        .setup(m => m.deleteTabContext(EXISTING_ACTIVE_TAB_ID))
                        .verifiable();
                    await testSubject.onTargetTabRemoved(EXISTING_ACTIVE_TAB_ID);
                });
            });

            describe('onWindowsFocusChanged', () => {
                beforeEach(() => {
                    setupDatabaseInstance(Times.never());
                    setupNeverDeleteTabs();
                });

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
                        setupInterpretMessageForTab(
                            EXISTING_ACTIVE_TAB_ID,
                            Messages.Tab.VisibilityChange,
                            { hidden: expectedHiddenValue },
                        );

                        await testSubject.onWindowFocusChanged();
                    },
                );

                it('should ignore inactive tabs', async () => {
                    setupNeverInterpretMessage(EXISTING_INACTIVE_TAB_ID);
                    setupInterpretMessageForTab(
                        EXISTING_ACTIVE_TAB_ID,
                        Messages.Tab.VisibilityChange,
                        { hidden: false },
                    );
                    await testSubject.onWindowFocusChanged();
                });
            });

            describe('onTabActivated', () => {
                beforeEach(() => {
                    idbInstanceMock.reset();
                    setupDatabaseInstance(Times.never());
                });

                it('should send a Tab.VisibilityChange message with isHidden=false for activation of known tabs', async () => {
                    const activeInfo: Tabs.OnActivatedActiveInfoType = {
                        tabId: EXISTING_INACTIVE_TAB_ID,
                        windowId: EXISTING_WINDOW_ID,
                    };
                    activateTabInBrowserMock(EXISTING_INACTIVE_TAB_ID);

                    setupInterpretMessageForTab(
                        EXISTING_INACTIVE_TAB_ID,
                        Messages.Tab.VisibilityChange,
                        { hidden: false },
                    );
                    setupInterpretMessageForTab(
                        EXISTING_ACTIVE_TAB_ID,
                        Messages.Tab.VisibilityChange,
                        { hidden: true },
                    );

                    await testSubject.onTabActivated(activeInfo);
                });

                it('should send a Tab.VisibilityChange message with isHidden=true for other known tabs in the same window when a known tab is activated', async () => {
                    const activeInfo: Tabs.OnActivatedActiveInfoType = {
                        tabId: EXISTING_INACTIVE_TAB_ID,
                        windowId: EXISTING_WINDOW_ID,
                    };
                    activateTabInBrowserMock(EXISTING_INACTIVE_TAB_ID);

                    setupInterpretMessageForTab(
                        EXISTING_ACTIVE_TAB_ID,
                        Messages.Tab.VisibilityChange,
                        { hidden: true },
                    );
                    setupInterpretMessageForTab(
                        EXISTING_INACTIVE_TAB_ID,
                        Messages.Tab.VisibilityChange,
                        { hidden: false },
                    );

                    await testSubject.onTabActivated(activeInfo);
                });

                it('should send a Tab.VisibilityChange message with isHidden=true for other known tabs in the same window when an untracked tab is activated', async () => {
                    const activeInfo: Tabs.OnActivatedActiveInfoType = {
                        tabId: NEW_TAB_ID,
                        windowId: EXISTING_WINDOW_ID,
                    };
                    activateTabInBrowserMock(NEW_TAB_ID);

                    setupInterpretMessageForTab(
                        EXISTING_ACTIVE_TAB_ID,
                        Messages.Tab.VisibilityChange,
                        { hidden: true },
                    );
                    setupInterpretMessageForTab(
                        EXISTING_INACTIVE_TAB_ID,
                        Messages.Tab.VisibilityChange,
                        { hidden: true },
                    );
                    setupInterpretMessageForTab(NEW_TAB_ID, Messages.Tab.VisibilityChange, {
                        hidden: false,
                    });

                    await testSubject.onTabActivated(activeInfo);
                });
            });

            describe('onTabUpdated', () => {
                beforeEach(() => {
                    idbInstanceMock.reset();
                });

                const changeInfoWithoutUrl: Tabs.OnUpdatedChangeInfoType = {};
                const changeInfoWithUrl: Tabs.OnUpdatedChangeInfoType = {
                    url: 'https://new-host/new-page',
                };

                it("should ignore updates that don't change the url", async () => {
                    setupDatabaseInstance(Times.never());
                    setupNeverInterpretMessage();
                    updateTabInBrowserMock(EXISTING_ACTIVE_TAB_ID, changeInfoWithoutUrl);

                    await testSubject.onTabUpdated(EXISTING_ACTIVE_TAB_ID, changeInfoWithoutUrl);
                });

                it('should initialize a new tab context for url changes in untracked tabs', async () => {
                    setupDatabaseInstance(Times.once(), [
                        EXISTING_ACTIVE_TAB_ID,
                        EXISTING_INACTIVE_TAB_ID,
                        NEW_TAB_ID,
                    ]);
                    setupInterpretMessageForTab(NEW_TAB_ID, Messages.Tab.ExistingTabUpdated, {
                        ...NEW_TAB,
                    });
                    setupTryCreateTabContexts([NEW_TAB_ID]);
                    mockBrowserAdapter.tabs.push(NEW_TAB);
                    updateTabInBrowserMock(NEW_TAB_ID, changeInfoWithoutUrl);

                    await testSubject.onTabUpdated(NEW_TAB_ID, changeInfoWithUrl);
                });

                it('should send a Tab.ExistingTabUpdated message for url changes in tracked tabs', async () => {
                    setupDatabaseInstance(Times.once(), null, {
                        1: changeInfoWithUrl.url,
                        2: '',
                    });
                    setupInterpretMessageForTab(
                        EXISTING_ACTIVE_TAB_ID,
                        Messages.Tab.ExistingTabUpdated,
                        {
                            ...EXISTING_ACTIVE_TAB,
                            url: changeInfoWithUrl.url,
                        },
                    );
                    updateTabInBrowserMock(EXISTING_ACTIVE_TAB_ID, changeInfoWithUrl);

                    await testSubject.onTabUpdated(EXISTING_ACTIVE_TAB_ID, changeInfoWithUrl);

                    await flushSettledPromises();
                });
            });
        });
    });

    function setupTryCreateTabContexts(tabIds: number[]) {
        tabIds.forEach(tabId => {
            mockTabContextManager
                .setup(m => m.addTabContextIfNotExists(tabId, mockTabContextFactory.object))
                .verifiable(Times.atLeastOnce());
        });
    }

    function setupNeverCreateTabContexts(tabIds: number[]) {
        tabIds.forEach(tabId => {
            mockTabContextManager
                .setup(m => m.addTabContextIfNotExists(tabId, It.isAny()))
                .verifiable(Times.never());
        });
    }

    function setupNeverInterpretMessage(tabId?: number): void {
        mockTabContextManager
            .setup(m => m.interpretMessageForTab(tabId ? tabId : It.isAny(), It.isAny()))
            .verifiable(Times.never());
    }

    function setupInterpretMessageForTab(
        tabId: number,
        messageType?: string,
        payload: any = null,
    ): void {
        let expectedMessage: InterpreterMessage;
        if (messageType === undefined) {
            expectedMessage = It.isAny();
        } else {
            expectedMessage = {
                tabId,
                messageType,
                payload,
            };
        }
        mockTabContextManager
            .setup(m => m.interpretMessageForTab(tabId, expectedMessage))
            .returns(() => ({ messageHandled: true, result: undefined }))
            .verifiable();
    }

    function setupNeverDeleteTabs(): void {
        mockTabContextManager.setup(m => m.deleteTabContext(It.isAny())).verifiable(Times.never());
    }

    const setupDatabaseInstance = (
        times: Times,
        expectedList: number[] = null,
        expectedMap: DictionaryNumberTo<string> = null,
    ) => {
        if (expectedList || expectedMap) {
            if (expectedList && !expectedMap) {
                expectedMap = {};
                expectedList.forEach(tabId => {
                    expectedMap[tabId] = '';
                });
            }
            idbInstanceMock
                .setup(db => db.setItem(indexedDBDataKey, expectedMap))
                .returns(() => Promise.resolve(true))
                .verifiable(times);
        } else {
            idbInstanceMock.setup(db => db.setItem(indexedDBDataKey, It.isAny())).verifiable(times);
        }
    };

    function activateTabInBrowserMock(tabIdToActivate: number): void {
        mockBrowserAdapter.tabs.forEach((tab, index) => {
            mockBrowserAdapter.tabs[index] = { ...tab, active: tab.id === tabIdToActivate };
        });
    }

    function updateTabInBrowserMock(tabId: number, changeInfo: Tabs.OnUpdatedChangeInfoType): void {
        const tabIndex = mockBrowserAdapter.tabs.findIndex(tab => tab.id === tabId);
        expect(tabIndex).toBeGreaterThanOrEqual(0);

        const tab = mockBrowserAdapter.tabs[tabIndex];
        mockBrowserAdapter.tabs[tabIndex] = { ...tab, ...changeInfo };
    }
});
