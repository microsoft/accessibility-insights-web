// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewController } from 'background/details-view-controller';
import { Interpreter } from 'background/interpreter';
import { TabContextBroadcaster } from 'background/tab-context-broadcaster';
import { TabContextFactory } from 'background/tab-context-factory';
import { TargetPageController } from 'background/target-page-controller';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { Logger } from 'common/logging/logger';
import { Messages } from 'common/messages';
import { some, values } from 'lodash';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { DictionaryNumberTo } from 'types/common-types';

describe('TargetPageController', () => {
    let mockLogger: IMock<Logger>;
    let mockBroadcasterStrictMock: IMock<TabContextBroadcaster>;
    let mockTabContextFactory: IMock<TabContextFactory>;
    let mockBrowserAdapter: ExtendedMockBrowserAdapter;
    let mockDetailsViewController: ExtendedMockDetailsViewController;
    let mockTabInterpreters: DictionaryNumberTo<IMock<Interpreter>>;

    let testSubject: TargetPageController;

    beforeEach(() => {
        mockLogger = Mock.ofType<Logger>();
        const stubBroadcastDelegate = (message: any) => {};
        mockBroadcasterStrictMock = Mock.ofType<TabContextBroadcaster>(undefined, MockBehavior.Strict);
        mockBroadcasterStrictMock.setup(m => m.getBroadcastMessageDelegate(It.isAny())).returns(_ => stubBroadcastDelegate);
        mockTabContextFactory = Mock.ofType(TabContextFactory);
        mockBrowserAdapter = setupMockBrowserAdapter();
        mockDetailsViewController = setupMockDetailsViewController();
        mockTabInterpreters = {};
        mockTabInterpreters[EXISTING_ACTIVE_TAB_ID] = Mock.ofType<Interpreter>();
        mockTabInterpreters[EXISTING_INACTIVE_TAB_ID] = Mock.ofType<Interpreter>();
        mockTabInterpreters[NEW_TAB_ID] = Mock.ofType<Interpreter>();
        mockTabContextFactory
            .setup(m =>
                m.createTabContext(stubBroadcastDelegate, mockBrowserAdapter.object, mockDetailsViewController.object, It.isAnyNumber()),
            )
            .returns((_1, _2, _3, tabId) => ({
                // s
                stores: null,
                interpreter: mockTabInterpreters[tabId].object,
            }));

        testSubject = new TargetPageController(
            {},
            mockBroadcasterStrictMock.object,
            mockBrowserAdapter.object,
            mockDetailsViewController.object,
            mockTabContextFactory.object,
            mockLogger.object,
        );
    });

    describe('initialize', () => {
        it('should create a tab context for each pre-existing tab', () => {
            testSubject.initialize();

            mockTabContextFactory.verify(f => f.createTabContext(It.isAny(), It.isAny(), It.isAny(), EXISTING_ACTIVE_TAB_ID), Times.once());
            mockTabContextFactory.verify(
                f => f.createTabContext(It.isAny(), It.isAny(), It.isAny(), EXISTING_INACTIVE_TAB_ID),
                Times.once(),
            );
            mockTabContextFactory.verify(f => f.createTabContext(It.isAny(), It.isAny(), It.isAny(), NEW_TAB_ID), Times.never());
        });
    });

    describe('in initialized state', () => {
        beforeEach(() => {
            testSubject.initialize();
            resetAll(mockTabInterpreters);
        });

        describe('onConnect', () => {
            it('should not have any observable effect', () => {
                mockBrowserAdapter.notifyOnConnect({ name: 'irrelevant port' } as chrome.runtime.Port);
                verifyNoMessages(mockTabInterpreters);
            });
        });

        describe('onWebNavigationUpdated', () => {
            const rootFrameId = 0;
            const nonRootFrameId = 1;

            it('should ignore updates for non-root frames', () => {
                mockBrowserAdapter.notifyWebNavigationUpdated({
                    frameId: nonRootFrameId,
                    tabId: EXISTING_ACTIVE_TAB_ID,
                } as chrome.webNavigation.WebNavigationFramedCallbackDetails);

                verifyNoMessages(mockTabInterpreters);
            });

            it('should initialize a new tab context for root frames in new tabs', () => {
                mockBrowserAdapter.notifyWebNavigationUpdated({
                    frameId: rootFrameId,
                    tabId: NEW_TAB_ID,
                } as chrome.webNavigation.WebNavigationFramedCallbackDetails);

                mockTabContextFactory.verify(f => f.createTabContext(It.isAny(), It.isAny(), It.isAny(), NEW_TAB_ID), Times.once());
            });

            it('should send an Tab.ExistingTabUpdated message for root frames in existing tabs', () => {
                mockBrowserAdapter.notifyWebNavigationUpdated({
                    frameId: rootFrameId,
                    tabId: EXISTING_ACTIVE_TAB_ID,
                } as chrome.webNavigation.WebNavigationFramedCallbackDetails);

                const expectedMessage = {
                    messageType: Messages.Tab.ExistingTabUpdated,
                    payload: EXISTING_ACTIVE_TAB,
                    tabId: EXISTING_ACTIVE_TAB_ID,
                };
                mockTabInterpreters[EXISTING_ACTIVE_TAB_ID].verify(i => i.interpret(expectedMessage), Times.once());
            });
        });

        describe('onTabRemoved', () => {
            it('should ignore removals of non-tracked tabs', () => {
                mockBrowserAdapter.notifyTabsOnRemoved(NEW_TAB_ID, null);
                verifyNoMessages(mockTabInterpreters);
            });

            it('should send a Tab.Remove message for tracked tabs', () => {
                const expectedMessage = {
                    messageType: Messages.Tab.Remove,
                    payload: null,
                    tabId: EXISTING_ACTIVE_TAB_ID,
                };
                mockBrowserAdapter.notifyTabsOnRemoved(EXISTING_ACTIVE_TAB_ID, null);
                mockTabInterpreters[EXISTING_ACTIVE_TAB_ID].verify(i => i.interpret(expectedMessage), Times.once());
            });

            it('should stop tracking tabs that are removed', () => {
                mockBrowserAdapter.notifyTabsOnRemoved(EXISTING_ACTIVE_TAB_ID, null);
                resetAll(mockTabInterpreters);

                mockBrowserAdapter.notifyTabsOnRemoved(EXISTING_ACTIVE_TAB_ID, null);
                verifyNoMessages(mockTabInterpreters);
            });
        });

        describe('onDetailsViewTabRemoved', () => {
            it('should ignore removals of non-tracked tabs', () => {
                mockDetailsViewController.notifyDetailsViewTabRemoved(NEW_TAB_ID);
                verifyNoMessages(mockTabInterpreters);
            });

            it('should send a Messages.Visualizations.DetailsView.Close message for tracked tabs', () => {
                mockDetailsViewController.notifyDetailsViewTabRemoved(EXISTING_ACTIVE_TAB_ID);

                const expectedMessage = {
                    messageType: Messages.Visualizations.DetailsView.Close,
                    payload: null,
                    tabId: EXISTING_ACTIVE_TAB_ID,
                };
                mockTabInterpreters[EXISTING_ACTIVE_TAB_ID].verify(i => i.interpret(expectedMessage), Times.once());
            });
        });

        describe('onWindowsFocusChanged', () => {
            it('should send an updated Tab.VisibilityChange message based on window state for each active tab in all windows', () => {
                throw new Error('not implemented');
            });

            it('should ignore untracked tabs', () => {
                throw new Error('not implemented');
            });

            it('should ignore inactive tabs', () => {
                throw new Error('not implemented');
            });

            it('should ignore tabs for windows which cannot be queried', () => {
                throw new Error('not implemented');
            });
        });

        describe('onTabActivated', () => {
            it('should send a Tab.VisibilityChange message with isHidden=false for activation of known tabs', () => {
                throw new Error('not implemented');
            });

            it('should send a Tab.VisibilityChange message with isHidden=true for other known tabs in the same window when a known tab is activated', () => {
                throw new Error('not implemented');
            });

            it('should send a Tab.VisibilityChange message with isHidden=true for other known tabs in the same window when an untracked tab is activated', () => {
                throw new Error('not implemented');
            });

            it('should ignore activation of untracked tabs', () => {
                throw new Error('not implemented');
            });

            it('should ignore deactivation of untracked tabs', () => {
                throw new Error('not implemented');
            });
        });

        describe('onTabUpdated', () => {
            const changeInfoWithoutUrl: chrome.tabs.TabChangeInfo = {};
            const changeInfoWithUrl: chrome.tabs.TabChangeInfo = { url: 'https://new-host/new-page' };

            it("should ignore updates that don't change the url", () => {
                mockBrowserAdapter.updateTab(EXISTING_ACTIVE_TAB_ID, changeInfoWithoutUrl);
                verifyNoMessages(mockTabInterpreters);
            });

            it('should initialize a new tab context for url changes in untracked tabs', () => {
                mockBrowserAdapter.tabs.push(NEW_TAB);
                mockBrowserAdapter.updateTab(NEW_TAB_ID, changeInfoWithUrl);

                mockTabContextFactory.verify(f => f.createTabContext(It.isAny(), It.isAny(), It.isAny(), NEW_TAB_ID), Times.once());
            });

            it('should send a Tab.ExistingTabUpdated message for url changes in tracked tabs', () => {
                const expectedMessage = {
                    messageType: Messages.Tab.ExistingTabUpdated,
                    payload: { ...EXISTING_ACTIVE_TAB, url: changeInfoWithUrl.url },
                    tabId: EXISTING_ACTIVE_TAB_ID,
                };
                mockBrowserAdapter.updateTab(EXISTING_ACTIVE_TAB_ID, changeInfoWithUrl);

                mockTabInterpreters[EXISTING_ACTIVE_TAB_ID].verify(i => i.interpret(expectedMessage), Times.once());
            });
        });
    });
});

const EXISTING_WINDOW_ID = 101;

const EXISTING_ACTIVE_TAB_ID = 1;
const EXISTING_ACTIVE_TAB = { id: EXISTING_ACTIVE_TAB_ID, windowId: EXISTING_WINDOW_ID, active: true } as chrome.tabs.Tab;

const EXISTING_INACTIVE_TAB_ID = 2;
const EXISTING_INACTIVE_TAB = { id: EXISTING_INACTIVE_TAB_ID, windowId: EXISTING_WINDOW_ID, active: false } as chrome.tabs.Tab;

const NEW_TAB_ID = 3;
const NEW_TAB = { id: NEW_TAB_ID, windowId: EXISTING_WINDOW_ID, active: true } as chrome.tabs.Tab;

type ExtendedMockDetailsViewController = IMock<DetailsViewController> & {
    notifyDetailsViewTabRemoved?: (tabId: number) => void;
};

function setupMockDetailsViewController(): ExtendedMockDetailsViewController {
    const mock: ExtendedMockDetailsViewController = Mock.ofType<DetailsViewController>();
    mock.setup(m => m.setupDetailsViewTabRemovedHandler(It.isAny())).callback(c => (mock.notifyDetailsViewTabRemoved = c));
    return mock;
}

type ExtendedMockBrowserAdapter = IMock<BrowserAdapter> & {
    windows?: chrome.windows.Window[];
    tabs?: chrome.tabs.Tab[];

    notifyOnConnect?: (port: chrome.runtime.Port) => void;
    notifyTabsOnActivated?: (activeInfo: chrome.tabs.TabActiveInfo) => void;
    notifyTabsOnUpdated?: (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => void;
    notifyTabsOnRemoved?: (tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => void;
    notifyWebNavigationUpdated?: (details: chrome.webNavigation.WebNavigationFramedCallbackDetails) => void;
    notifyWindowsFocusChanged?: (windowId: number) => void;

    updateTab?: (tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => void;
};

function setupMockBrowserAdapter(): ExtendedMockBrowserAdapter {
    const mock: ExtendedMockBrowserAdapter = Mock.ofType<BrowserAdapter>();
    mock.tabs = [EXISTING_ACTIVE_TAB, EXISTING_INACTIVE_TAB];
    mock.windows = [{ id: EXISTING_WINDOW_ID } as chrome.windows.Window];
    mock.setup(m => m.addListenerOnConnect(It.isAny())).callback(c => (mock.notifyOnConnect = c));
    mock.setup(m => m.addListenerToTabsOnActivated(It.isAny())).callback(c => (mock.notifyTabsOnActivated = c));
    mock.setup(m => m.addListenerToTabsOnUpdated(It.isAny())).callback(c => (mock.notifyTabsOnUpdated = c));
    mock.setup(m => m.addListenerToTabsOnRemoved(It.isAny())).callback(c => (mock.notifyTabsOnRemoved = c));
    mock.setup(m => m.addListenerToWebNavigationUpdated(It.isAny())).callback(c => (mock.notifyWebNavigationUpdated = c));
    mock.setup(m => m.addListenerOnWindowsFocusChanged(It.isAny())).callback(c => (mock.notifyWindowsFocusChanged = c));

    mock.setup(m => m.getAllWindows(It.isAny(), It.isAny())).callback((_, c) => c(mock.windows));
    mock.setup(m => m.getTab(It.isAny(), It.isAny(), It.isAny())).callback((tabId, resolve, reject) => {
        const matchingTabs = mock.tabs.filter(tab => tab.id === tabId);
        if (matchingTabs.length === 1) {
            resolve(matchingTabs[0]);
        } else if (reject != null) {
            reject();
        }
    });
    mock.setup(m => m.getRuntimeLastError()).returns(null);
    // prettier-ignore
    mock.setup(m => m.tabsQuery(It.isAny(), It.isAny())).callback((query, c) => c(mock.tabs.filter(tab => (
        query.active != null ? tab.active === query.active : true &&
        query.windowId != null ? tab.windowId === query.windowId : true))));

    mock.updateTab = (tabId, changeInfo) => {
        mock.tabs
            .filter(tab => tab.id === tabId)
            .forEach((tab, index) => {
                mock.tabs[index] = { ...tab, ...changeInfo };
                mock.notifyTabsOnUpdated(tabId, changeInfo, mock.tabs[index]);
            });
    };
    return mock;
}

function resetAll(interpreters: DictionaryNumberTo<IMock<Interpreter>>): void {
    for (const interpreter of values(interpreters)) {
        interpreter.reset();
    }
}

function verifyNoMessages(interpreters: DictionaryNumberTo<IMock<Interpreter>>): void {
    for (const interpreter of values(interpreters)) {
        interpreter.verify(i => i.interpret(It.isAny()), Times.never());
    }
}
