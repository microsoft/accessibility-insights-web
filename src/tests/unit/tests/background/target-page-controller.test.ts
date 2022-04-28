// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TabContextFactory } from 'background/tab-context-factory';
import { TabContextManager } from 'background/tab-context-manager';
import { TargetPageController } from 'background/target-page-controller';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Logger } from 'common/logging/logger';
import { Message } from 'common/message';
import { Messages } from 'common/messages';
import { flushSettledPromises } from 'tests/common/flush-settled-promises';
import {
    createSimulatedBrowserAdapter,
    SimulatedBrowserAdapter,
} from 'tests/unit/common/simulated-browser-adapter';
import { IMock, It, Mock, Times } from 'typemoq';
import { DictionaryNumberTo } from 'types/common-types';

describe('TargetPageController', () => {
    let testSubject: TargetPageController;

    let mockLogger: IMock<Logger>;
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
        mockBrowserAdapter = createSimulatedBrowserAdapter(
            [EXISTING_ACTIVE_TAB, EXISTING_INACTIVE_TAB],
            [EXISTING_WINDOW],
        );
        mockTabContextFactory = Mock.ofType<TabContextFactory>();
        mockTabContextManager = Mock.ofType<TabContextManager>();
        idbInstanceMock.reset();
        knownTabIds = {};
    });

    describe('No Persisted Data', () => {
        beforeEach(() => {
            testSubject = new TargetPageController(
                mockTabContextManager.object,
                mockTabContextFactory.object,
                mockBrowserAdapter.object,
                mockLogger.object,
                knownTabIds,
                idbInstanceMock.object,
                false,
            );

            idbInstanceMock.reset();

            setupDatabaseInstance(Times.never());
        });

        afterEach(() => {
            mockTabContextManager.verifyAll();
            mockTabContextFactory.verifyAll();
            idbInstanceMock.verifyAll();
        });

        it('should not persist data on init', async () => {
            setupTryCreateTabContexts([EXISTING_ACTIVE_TAB_ID, EXISTING_INACTIVE_TAB_ID]);
            setupNeverCreateTabContexts([NEW_TAB_ID]);

            await testSubject.initialize();
        });

        it('should not persist data for new tabs', async () => {
            await testSubject.initialize();

            setupTryCreateTabContexts([NEW_TAB_ID]);

            await mockBrowserAdapter.notifyWebNavigationUpdated({
                frameId: 0,
                tabId: NEW_TAB_ID,
            } as chrome.webNavigation.WebNavigationFramedCallbackDetails);
        });

        it('should not persist data for tabs that are removed', async () => {
            await testSubject.initialize();

            mockTabContextManager
                .setup(m => m.deleteTabContext(EXISTING_ACTIVE_TAB_ID))
                .verifiable();

            await mockBrowserAdapter.notifyTabsOnRemoved(EXISTING_ACTIVE_TAB_ID, null);
        });

        it('should remove tabs that no longer exist', async () => {
            knownTabIds[EXISTING_ACTIVE_TAB_ID] = undefined;
            knownTabIds[EXISTING_INACTIVE_TAB_ID] = undefined;
            knownTabIds[NEW_TAB_ID] = undefined;
            setupTryCreateTabContexts([
                EXISTING_ACTIVE_TAB_ID,
                EXISTING_INACTIVE_TAB_ID,
                NEW_TAB_ID,
            ]);

            setupNeverInterpretMessage(EXISTING_ACTIVE_TAB_ID);
            setupNeverInterpretMessage(EXISTING_INACTIVE_TAB_ID);
            setupInterpretMessageForTab(NEW_TAB_ID, Messages.Tab.Remove);

            await testSubject.initialize();
        });
    });

    describe('Persisted Data', () => {
        beforeEach(() => {
            testSubject = new TargetPageController(
                mockTabContextManager.object,
                mockTabContextFactory.object,
                mockBrowserAdapter.object,
                mockLogger.object,
                knownTabIds,
                idbInstanceMock.object,
                true,
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

            it('should register the expected listeners', async () => {
                setupDatabaseInstance(Times.once(), [EXISTING_ACTIVE_TAB_ID]);
                setupDatabaseInstance(Times.once(), [
                    EXISTING_ACTIVE_TAB_ID,
                    EXISTING_INACTIVE_TAB_ID,
                ]);
                setupNeverDeleteTabs();

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
                mockBrowserAdapter.verify(
                    m => m.addListenerToTabsOnRemoved(It.isAny()),
                    Times.once(),
                );
                mockBrowserAdapter.verify(
                    m => m.addListenerToTabsOnUpdated(It.isAny()),
                    Times.once(),
                );
                mockBrowserAdapter.verify(
                    m => m.addListenerToWebNavigationUpdated(It.isAny()),
                    Times.once(),
                );
            });

            it('should create a tab context for each pre-existing tab', async () => {
                setupDatabaseInstance(Times.once(), [EXISTING_ACTIVE_TAB_ID]);
                setupDatabaseInstance(Times.once(), [
                    EXISTING_ACTIVE_TAB_ID,
                    EXISTING_INACTIVE_TAB_ID,
                ]);

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
                    .verifiable();

                await testSubject.initialize();
            });
        });

        describe('in initialized state', () => {
            beforeEach(async () => {
                await testSubject.initialize();
                idbInstanceMock.reset();
                mockTabContextManager.reset();
            });

            describe('onConnect', () => {
                it('should not have any observable effect', async () => {
                    setupDatabaseInstance(Times.never());
                    setupNeverInterpretMessage();

                    await mockBrowserAdapter.notifyOnConnect({
                        name: 'irrelevant port',
                    } as chrome.runtime.Port);
                });
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

                    await mockBrowserAdapter.notifyWebNavigationUpdated({
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

                    await mockBrowserAdapter.notifyWebNavigationUpdated({
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

                    await mockBrowserAdapter.notifyWebNavigationUpdated({
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

                    await mockBrowserAdapter.notifyTabsOnRemoved(NEW_TAB_ID, null);
                });

                it('should send a Tab.Remove message and update database for tracked tabs', async () => {
                    setupDatabaseInstance(Times.once(), [EXISTING_INACTIVE_TAB_ID]);
                    mockTabContextManager
                        .setup(m => m.deleteTabContext(EXISTING_ACTIVE_TAB_ID))
                        .verifiable();
                    setupInterpretMessageForTab(EXISTING_ACTIVE_TAB_ID, Messages.Tab.Remove);

                    await mockBrowserAdapter.notifyTabsOnRemoved(EXISTING_ACTIVE_TAB_ID, null);
                });

                it('should remove tabToContextMap entries for tabs that are removed', async () => {
                    setupDatabaseInstance(Times.once(), [EXISTING_INACTIVE_TAB_ID]);
                    mockTabContextManager
                        .setup(m => m.deleteTabContext(EXISTING_ACTIVE_TAB_ID))
                        .verifiable();
                    await mockBrowserAdapter.notifyTabsOnRemoved(EXISTING_ACTIVE_TAB_ID, null);
                });
            });

            describe('onWindowsFocusChanged', () => {
                beforeEach(() => {
                    setupDatabaseInstance(Times.never());
                    setupNeverDeleteTabs();
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
                        setupInterpretMessageForTab(
                            EXISTING_ACTIVE_TAB_ID,
                            Messages.Tab.VisibilityChange,
                            { hidden: expectedHiddenValue },
                        );

                        mockBrowserAdapter.notifyWindowsFocusChanged(irrelevantWindowId);

                        await flushSettledPromises();
                    },
                );

                it('should ignore inactive tabs', () => {
                    setupNeverInterpretMessage(EXISTING_INACTIVE_TAB_ID);
                    mockBrowserAdapter.notifyWindowsFocusChanged(irrelevantWindowId);
                });
            });

            describe('onTabActivated', () => {
                beforeEach(() => {
                    idbInstanceMock.reset();
                    setupDatabaseInstance(Times.never());
                });

                it('should send a Tab.VisibilityChange message with isHidden=false for activation of known tabs', () => {
                    setupInterpretMessageForTab(
                        EXISTING_INACTIVE_TAB_ID,
                        Messages.Tab.VisibilityChange,
                        { hidden: false },
                    );

                    mockBrowserAdapter.activateTab(EXISTING_INACTIVE_TAB);
                });

                it('should send a Tab.VisibilityChange message with isHidden=true for other known tabs in the same window when a known tab is activated', async () => {
                    setupInterpretMessageForTab(
                        EXISTING_ACTIVE_TAB_ID,
                        Messages.Tab.VisibilityChange,
                        { hidden: true },
                    );

                    await mockBrowserAdapter.activateTab(EXISTING_INACTIVE_TAB);
                });

                it('should send a Tab.VisibilityChange message with isHidden=true for other known tabs in the same window when an untracked tab is activated', async () => {
                    setupInterpretMessageForTab(
                        EXISTING_ACTIVE_TAB_ID,
                        Messages.Tab.VisibilityChange,
                        { hidden: true },
                    );
                    await mockBrowserAdapter.activateTab(NEW_TAB);
                });
            });

            describe('onTabUpdated', () => {
                beforeEach(() => {
                    idbInstanceMock.reset();
                });

                const changeInfoWithoutUrl: chrome.tabs.TabChangeInfo = {};
                const changeInfoWithUrl: chrome.tabs.TabChangeInfo = {
                    url: 'https://new-host/new-page',
                };

                it("should ignore updates that don't change the url", async () => {
                    setupDatabaseInstance(Times.never());
                    setupNeverInterpretMessage();
                    await mockBrowserAdapter.updateTab(
                        EXISTING_ACTIVE_TAB_ID,
                        changeInfoWithoutUrl,
                    );
                });

                it('should initialize a new tab context for url changes in untracked tabs', async () => {
                    setupDatabaseInstance(Times.once(), [
                        EXISTING_ACTIVE_TAB_ID,
                        EXISTING_INACTIVE_TAB_ID,
                        NEW_TAB_ID,
                    ]);
                    setupTryCreateTabContexts([NEW_TAB_ID]);
                    mockBrowserAdapter.tabs.push(NEW_TAB);
                    await mockBrowserAdapter.updateTab(NEW_TAB_ID, changeInfoWithUrl);
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

                    await mockBrowserAdapter.updateTab(EXISTING_ACTIVE_TAB_ID, changeInfoWithUrl);
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
        let expectedMessage: Message;
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
});
