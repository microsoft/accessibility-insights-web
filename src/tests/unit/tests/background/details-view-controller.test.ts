// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewController } from 'background/details-view-controller';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { IMock, It, Mock, Times } from 'typemoq';

describe('DetailsViewControllerTest', () => {
    let mockBrowserAdapter: IMock<BrowserAdapter>;
    let testSubject: DetailsViewController;
    let onTabRemoveCallback: (tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => void;
    let onUpdateTabCallback: (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => void;

    beforeEach(() => {
        mockBrowserAdapter = Mock.ofType<BrowserAdapter>();

        mockBrowserAdapter
            .setup(adapter => adapter.addListenerToTabsOnRemoved(It.isAny()))
            .callback(callback => {
                onTabRemoveCallback = callback;
            })
            .verifiable();

        mockBrowserAdapter
            .setup(adapter => adapter.addListenerToTabsOnUpdated(It.isAny()))
            .callback(callback => {
                onUpdateTabCallback = callback;
            })
            .verifiable();

        testSubject = new DetailsViewController(mockBrowserAdapter.object);
    });

    test('showDetailsView first time', () => {
        const targetTabId = 12;
        const detailsViewTabId = 10;

        setupCreateDetailsView(targetTabId)
            .callback((url, func) => {
                func({
                    id: detailsViewTabId,
                } as chrome.tabs.Tab);
            })
            .verifiable(Times.once());

        testSubject.showDetailsView(targetTabId);

        mockBrowserAdapter.verifyAll();
    });

    test('showDetailsView second time', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        setupCreateDetailsView(targetTabId).callback((url, func) => {
            createTabCallback = func;
        });

        // call show details once
        testSubject.showDetailsView(targetTabId);

        createTabCallback({
            id: detailsViewTabId,
        } as chrome.tabs.Tab);

        mockBrowserAdapter.reset();

        setupCreateDetailsViewForAnyUrl(Times.never());

        mockBrowserAdapter.setup(adapter => adapter.switchToTab(detailsViewTabId)).verifiable(Times.once());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        mockBrowserAdapter.verifyAll();
    });

    test('showDetailsView after target tab updated', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        setupCreateDetailsView(targetTabId).callback((url, func) => {
            createTabCallback = func;
        });

        // call show details once
        testSubject.showDetailsView(targetTabId);

        createTabCallback({
            id: detailsViewTabId,
        } as chrome.tabs.Tab);

        mockBrowserAdapter.reset();

        // update target tab
        onUpdateTabCallback(targetTabId, null, null);

        setupCreateDetailsViewForAnyUrl(Times.never());

        mockBrowserAdapter.setup(adapter => adapter.switchToTab(detailsViewTabId)).verifiable(Times.once());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        mockBrowserAdapter.verifyAll();
    });

    test('showDetailsView after details tab navigated to another page', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        const detailsViewRemovedHandlerMock = Mock.ofInstance((tabId: number) => {});
        detailsViewRemovedHandlerMock.setup(handler => handler(targetTabId)).verifiable(Times.once());

        testSubject.setupDetailsViewTabRemovedHandler(detailsViewRemovedHandlerMock.object);

        setupCreateDetailsView(targetTabId).callback((url, func) => {
            createTabCallback = func;
        });

        // call show details once
        testSubject.showDetailsView(targetTabId);

        createTabCallback({
            id: detailsViewTabId,
        } as chrome.tabs.Tab);

        mockBrowserAdapter.reset();

        // update details tab
        mockBrowserAdapter
            .setup(adapter => adapter.getRunTimeId())
            .returns(() => {
                return 'ext_id';
            });
        onUpdateTabCallback(detailsViewTabId, { url: 'www.bing.com/DetailsView/detailsView.html?tabId=' + targetTabId }, null);

        setupCreateDetailsViewForAnyUrl(Times.once());

        mockBrowserAdapter.setup(adapter => adapter.switchToTab(detailsViewTabId)).verifiable(Times.never());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        mockBrowserAdapter.verifyAll();
        detailsViewRemovedHandlerMock.verifyAll();
    });

    test('showDetailsView after details tab navigated to different details page', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        setupCreateDetailsView(targetTabId).callback((url, func) => {
            createTabCallback = func;
        });

        // call show details once
        testSubject.showDetailsView(targetTabId);

        createTabCallback({
            id: detailsViewTabId,
        } as chrome.tabs.Tab);

        mockBrowserAdapter.reset();

        // update details tab
        const extensionId = 'ext_id';
        mockBrowserAdapter.setup(adapter => adapter.getRunTimeId()).returns(() => extensionId);
        onUpdateTabCallback(detailsViewTabId, { url: 'chromeExt://ext_id/DetailsView/detailsView.html?tabId=90' }, null);

        setupCreateDetailsViewForAnyUrl(Times.once());

        mockBrowserAdapter.setup(adapter => adapter.switchToTab(detailsViewTabId)).verifiable(Times.never());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        mockBrowserAdapter.verifyAll();
    });

    test('showDetailsView after details tab refresh', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        setupCreateDetailsView(targetTabId).callback((url, func) => {
            createTabCallback = func;
        });

        // call show details once
        testSubject.showDetailsView(targetTabId);

        createTabCallback({
            id: detailsViewTabId,
        } as chrome.tabs.Tab);

        mockBrowserAdapter.reset();

        // update details tab
        const extensionId = 'ext_id';
        mockBrowserAdapter
            .setup(it => it.getRunTimeId())
            .returns(() => {
                return extensionId;
            });
        onUpdateTabCallback(detailsViewTabId, { url: 'chromeExt://ext_Id/detailsView/detailsView.html?tabId=' + targetTabId }, null);

        setupCreateDetailsViewForAnyUrl(Times.never());

        mockBrowserAdapter.setup(adapter => adapter.switchToTab(detailsViewTabId)).verifiable(Times.once());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        mockBrowserAdapter.verifyAll();
    });

    test('showDetailsView after details tab title update', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        setupCreateDetailsView(targetTabId).callback((url, func) => {
            createTabCallback = func;
        });

        // call show details once
        testSubject.showDetailsView(targetTabId);

        createTabCallback({
            id: detailsViewTabId,
        } as chrome.tabs.Tab);

        mockBrowserAdapter.reset();

        // update details tab
        const extensionId = 'ext_id';
        mockBrowserAdapter
            .setup(adapter => adapter.getRunTimeId())
            .returns(() => {
                return extensionId;
            });
        onUpdateTabCallback(detailsViewTabId, { title: 'issues' }, null);

        setupCreateDetailsViewForAnyUrl(Times.never());

        mockBrowserAdapter.setup(adapter => adapter.switchToTab(detailsViewTabId)).verifiable(Times.once());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        mockBrowserAdapter.verifyAll();
    });

    test('showDetailsView after random tab updated', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        setupCreateDetailsView(targetTabId).callback((url, func) => {
            createTabCallback = func;
        });

        // call show details once
        testSubject.showDetailsView(targetTabId);

        createTabCallback({
            id: detailsViewTabId,
        } as chrome.tabs.Tab);

        mockBrowserAdapter.reset();

        // remove details tab
        const extensionId = 'ext_id';
        mockBrowserAdapter
            .setup(adapter => adapter.getRunTimeId())
            .returns(() => {
                return extensionId;
            });
        onUpdateTabCallback(123, { title: 'issues' }, null);

        setupCreateDetailsViewForAnyUrl(Times.never());

        mockBrowserAdapter.setup(adapter => adapter.switchToTab(detailsViewTabId)).verifiable(Times.once());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        mockBrowserAdapter.verifyAll();
    });

    test('showDetailsView after target tab removed', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        setupCreateDetailsView(targetTabId).callback((url, func) => {
            createTabCallback = func;
        });

        // call show details once
        testSubject.showDetailsView(targetTabId);

        createTabCallback({
            id: detailsViewTabId,
        } as chrome.tabs.Tab);

        mockBrowserAdapter.reset();

        // remove target tab
        onTabRemoveCallback(targetTabId, null);

        setupCreateDetailsViewForAnyUrl(Times.once());

        mockBrowserAdapter.setup(adapter => adapter.switchToTab(detailsViewTabId)).verifiable(Times.never());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        mockBrowserAdapter.verifyAll();
    });

    test('showDetailsView after details tab removed', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        setupCreateDetailsView(targetTabId).callback((url, func) => {
            createTabCallback = func;
        });
        const detailsViewRemovedHandlerMock = Mock.ofInstance((tabId: number) => {});
        detailsViewRemovedHandlerMock.setup(handler => handler(targetTabId)).verifiable(Times.once());
        testSubject.setupDetailsViewTabRemovedHandler(detailsViewRemovedHandlerMock.object);

        // call show details once
        testSubject.showDetailsView(targetTabId);

        createTabCallback({
            id: detailsViewTabId,
        } as chrome.tabs.Tab);

        mockBrowserAdapter.reset();

        // remove details tab
        onTabRemoveCallback(detailsViewTabId, null);

        setupCreateDetailsViewForAnyUrl(Times.once());

        mockBrowserAdapter.setup(adapter => adapter.switchToTab(detailsViewTabId)).verifiable(Times.never());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        mockBrowserAdapter.verifyAll();
        detailsViewRemovedHandlerMock.verifyAll();
    });

    test('showDetailsView after details tab removed, remove handler not set', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        setupCreateDetailsView(targetTabId).callback((url, func) => {
            createTabCallback = func;
        });
        // call show details once
        testSubject.showDetailsView(targetTabId);

        createTabCallback({
            id: detailsViewTabId,
        } as chrome.tabs.Tab);

        mockBrowserAdapter.reset();

        // remove details tab
        onTabRemoveCallback(detailsViewTabId, null);

        setupCreateDetailsViewForAnyUrl(Times.once());

        mockBrowserAdapter.setup(adapter => adapter.switchToTab(detailsViewTabId)).verifiable(Times.never());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        mockBrowserAdapter.verifyAll();
    });

    test('showDetailsView after random tab removed', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        setupCreateDetailsView(targetTabId).callback((url, func) => {
            createTabCallback = func;
        });

        // call show details once
        testSubject.showDetailsView(targetTabId);

        createTabCallback({
            id: detailsViewTabId,
        } as chrome.tabs.Tab);

        mockBrowserAdapter.reset();

        // remove details tab
        onTabRemoveCallback(100, null);

        setupCreateDetailsViewForAnyUrl(Times.never());

        mockBrowserAdapter.setup(adapter => adapter.switchToTab(detailsViewTabId)).verifiable(Times.once());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        mockBrowserAdapter.verifyAll();
    });

    const setupCreateDetailsView = (targetTabId: number) => {
        return mockBrowserAdapter.setup(adapter =>
            adapter.createTabInNewWindow('DetailsView/detailsView.html?tabId=' + targetTabId, It.isAny()),
        );
    };

    const setupCreateDetailsViewForAnyUrl = (times: Times) => {
        mockBrowserAdapter.setup(adapter => adapter.createTabInNewWindow(It.isAny(), It.isAny())).verifiable(times);
    };
});
