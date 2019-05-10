// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, Times } from 'typemoq';

import { BrowserAdapter } from '../../../../background/browser-adapters/browser-adapter';
import { RuntimeAdapter } from '../../../../background/browser-adapters/runtime-adapter';
import { DetailsViewController } from '../../../../background/details-view-controller';

describe('DetailsViewControllerTest', () => {
    let browserAdpaterMock: IMock<BrowserAdapter>;
    let runtimeAdapterMock: IMock<RuntimeAdapter>;

    let testSubject: DetailsViewController;
    let onTabRemoveCallback: (tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => void;
    let onUpdateTabCallback: (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => void;

    beforeEach(() => {
        browserAdpaterMock = Mock.ofType<BrowserAdapter>();
        runtimeAdapterMock = Mock.ofType<RuntimeAdapter>();

        browserAdpaterMock
            .setup(it => it.addListenerToTabsOnRemoved(It.isAny()))
            .callback(callback => {
                onTabRemoveCallback = callback;
            })
            .verifiable();

        browserAdpaterMock
            .setup(it => it.addListenerToTabsOnUpdated(It.isAny()))
            .callback(callback => {
                onUpdateTabCallback = callback;
            })
            .verifiable();

        testSubject = new DetailsViewController(browserAdpaterMock.object, runtimeAdapterMock.object);

        browserAdpaterMock.verifyAll();
        browserAdpaterMock.reset();
    });

    test('showDetailsView first time', () => {
        const targetTabId = 12;
        const detailsViewTabId = 10;

        browserAdpaterMock
            .setup(it => it.createTabInNewWindow('DetailsView/detailsView.html?tabId=' + targetTabId, It.isAny()))
            .callback((url, func) => {
                func({
                    id: detailsViewTabId,
                } as chrome.tabs.Tab);
            })
            .verifiable(Times.once());

        testSubject.showDetailsView(targetTabId);

        browserAdpaterMock.verifyAll();
    });

    test('showDetailsView second time', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        browserAdpaterMock
            .setup(it => it.createTabInNewWindow('DetailsView/detailsView.html?tabId=' + targetTabId, It.isAny()))
            .callback((url, func) => {
                createTabCallback = func;
            });

        // call show details once
        testSubject.showDetailsView(targetTabId);

        createTabCallback({
            id: detailsViewTabId,
        } as chrome.tabs.Tab);

        browserAdpaterMock.reset();

        browserAdpaterMock.setup(it => it.createTabInNewWindow(It.isAny(), It.isAny())).verifiable(Times.never());

        browserAdpaterMock.setup(it => it.switchToTab(detailsViewTabId)).verifiable(Times.once());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        browserAdpaterMock.verifyAll();
    });

    test('showDetailsView after target tab updated', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        browserAdpaterMock
            .setup(it => it.createTabInNewWindow('DetailsView/detailsView.html?tabId=' + targetTabId, It.isAny()))
            .callback((url, func) => {
                createTabCallback = func;
            });

        // call show details once
        testSubject.showDetailsView(targetTabId);

        createTabCallback({
            id: detailsViewTabId,
        } as chrome.tabs.Tab);

        browserAdpaterMock.reset();

        // update target tab
        onUpdateTabCallback(targetTabId, null, null);

        browserAdpaterMock.setup(it => it.createTabInNewWindow(It.isAny(), It.isAny())).verifiable(Times.never());

        browserAdpaterMock.setup(it => it.switchToTab(detailsViewTabId)).verifiable(Times.once());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        browserAdpaterMock.verifyAll();
    });

    test('showDetailsView after details tab navigated to another page', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        const detailsViewRemovedHandlerMock = Mock.ofInstance((tabId: number) => {});
        detailsViewRemovedHandlerMock.setup(d => d(targetTabId)).verifiable(Times.once());

        testSubject.setupDetailsViewTabRemovedHandler(detailsViewRemovedHandlerMock.object);

        browserAdpaterMock
            .setup(it => it.createTabInNewWindow('DetailsView/detailsView.html?tabId=' + targetTabId, It.isAny()))
            .callback((url, func) => {
                createTabCallback = func;
            });

        // call show details once
        testSubject.showDetailsView(targetTabId);

        createTabCallback({
            id: detailsViewTabId,
        } as chrome.tabs.Tab);

        browserAdpaterMock.reset();

        // update details tab
        runtimeAdapterMock
            .setup(it => it.getRunTimeId())
            .returns(() => {
                return 'ext_id';
            });
        onUpdateTabCallback(detailsViewTabId, { url: 'www.bing.com/DetailsView/detailsView.html?tabId=' + targetTabId }, null);

        browserAdpaterMock.setup(it => it.createTabInNewWindow(It.isAny(), It.isAny())).verifiable(Times.once());

        browserAdpaterMock.setup(it => it.switchToTab(detailsViewTabId)).verifiable(Times.never());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        browserAdpaterMock.verifyAll();
        detailsViewRemovedHandlerMock.verifyAll();
    });

    test('showDetailsView after details tab navigated to different details page', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        browserAdpaterMock
            .setup(adapter => adapter.createTabInNewWindow('DetailsView/detailsView.html?tabId=' + targetTabId, It.isAny()))
            .callback((url, func) => {
                createTabCallback = func;
            });

        // call show details once
        testSubject.showDetailsView(targetTabId);

        createTabCallback({
            id: detailsViewTabId,
        } as chrome.tabs.Tab);

        browserAdpaterMock.reset();

        // update details tab
        const extensionId = 'ext_id';
        runtimeAdapterMock.setup(adapter => adapter.getRunTimeId()).returns(() => extensionId);
        onUpdateTabCallback(detailsViewTabId, { url: 'chromeExt://ext_id/DetailsView/detailsView.html?tabId=90' }, null);

        browserAdpaterMock.setup(adapter => adapter.createTabInNewWindow(It.isAny(), It.isAny())).verifiable(Times.once());

        browserAdpaterMock.setup(adapter => adapter.switchToTab(detailsViewTabId)).verifiable(Times.never());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        browserAdpaterMock.verifyAll();
    });

    test('showDetailsView after details tab refresh', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        browserAdpaterMock
            .setup(adapter => adapter.createTabInNewWindow('DetailsView/detailsView.html?tabId=' + targetTabId, It.isAny()))
            .callback((url, func) => {
                createTabCallback = func;
            });

        // call show details once
        testSubject.showDetailsView(targetTabId);

        createTabCallback({
            id: detailsViewTabId,
        } as chrome.tabs.Tab);

        browserAdpaterMock.reset();

        // update details tab
        const extensionId = 'ext_id';
        runtimeAdapterMock
            .setup(adapter => adapter.getRunTimeId())
            .returns(() => {
                return extensionId;
            });
        onUpdateTabCallback(detailsViewTabId, { url: 'chromeExt://ext_Id/detailsView/detailsView.html?tabId=' + targetTabId }, null);

        browserAdpaterMock.setup(adapter => adapter.createTabInNewWindow(It.isAny(), It.isAny())).verifiable(Times.never());

        browserAdpaterMock.setup(adapter => adapter.switchToTab(detailsViewTabId)).verifiable(Times.once());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        browserAdpaterMock.verifyAll();
    });

    test('showDetailsView after details tab title update', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        browserAdpaterMock
            .setup(adapter => adapter.createTabInNewWindow('DetailsView/detailsView.html?tabId=' + targetTabId, It.isAny()))
            .callback((url, func) => {
                createTabCallback = func;
            });

        // call show details once
        testSubject.showDetailsView(targetTabId);

        createTabCallback({
            id: detailsViewTabId,
        } as chrome.tabs.Tab);

        browserAdpaterMock.reset();

        // update details tab
        const extensionId = 'ext_id';
        runtimeAdapterMock.setup(adapter => adapter.getRunTimeId()).returns(() => extensionId);
        onUpdateTabCallback(detailsViewTabId, { title: 'issues' }, null);

        browserAdpaterMock.setup(adapter => adapter.createTabInNewWindow(It.isAny(), It.isAny())).verifiable(Times.never());

        browserAdpaterMock.setup(adapter => adapter.switchToTab(detailsViewTabId)).verifiable(Times.once());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        browserAdpaterMock.verifyAll();
    });

    test('showDetailsView after random tab updated', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        browserAdpaterMock
            .setup(adapter => adapter.createTabInNewWindow('DetailsView/detailsView.html?tabId=' + targetTabId, It.isAny()))
            .callback((url, func) => {
                createTabCallback = func;
            });

        // call show details once
        testSubject.showDetailsView(targetTabId);

        createTabCallback({
            id: detailsViewTabId,
        } as chrome.tabs.Tab);

        browserAdpaterMock.reset();

        // remove details tab
        const extensionId = 'ext_id';
        runtimeAdapterMock.setup(adapter => adapter.getRunTimeId()).returns(() => extensionId);
        onUpdateTabCallback(123, { title: 'issues' }, null);

        browserAdpaterMock.setup(adapter => adapter.createTabInNewWindow(It.isAny(), It.isAny())).verifiable(Times.never());

        browserAdpaterMock.setup(adapter => adapter.switchToTab(detailsViewTabId)).verifiable(Times.once());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        browserAdpaterMock.verifyAll();
    });

    test('showDetailsView after target tab removed', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        browserAdpaterMock
            .setup(adapter => adapter.createTabInNewWindow('DetailsView/detailsView.html?tabId=' + targetTabId, It.isAny()))
            .callback((url, func) => {
                createTabCallback = func;
            });

        // call show details once
        testSubject.showDetailsView(targetTabId);

        createTabCallback({
            id: detailsViewTabId,
        } as chrome.tabs.Tab);

        browserAdpaterMock.reset();

        // remove target tab
        onTabRemoveCallback(targetTabId, null);

        browserAdpaterMock.setup(adapter => adapter.createTabInNewWindow(It.isAny(), It.isAny())).verifiable(Times.once());

        browserAdpaterMock.setup(adapter => adapter.switchToTab(detailsViewTabId)).verifiable(Times.never());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        browserAdpaterMock.verifyAll();
    });

    test('showDetailsView after details tab removed', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        browserAdpaterMock
            .setup(adapter => adapter.createTabInNewWindow('DetailsView/detailsView.html?tabId=' + targetTabId, It.isAny()))
            .callback((url, func) => {
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

        browserAdpaterMock.reset();

        // remove details tab
        onTabRemoveCallback(detailsViewTabId, null);

        browserAdpaterMock.setup(adapter => adapter.createTabInNewWindow(It.isAny(), It.isAny())).verifiable(Times.once());

        browserAdpaterMock.setup(adapter => adapter.switchToTab(detailsViewTabId)).verifiable(Times.never());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        browserAdpaterMock.verifyAll();
        detailsViewRemovedHandlerMock.verifyAll();
    });

    test('showDetailsView after details tab removed, remove handler not set', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        browserAdpaterMock
            .setup(adapter => adapter.createTabInNewWindow('DetailsView/detailsView.html?tabId=' + targetTabId, It.isAny()))
            .callback((url, func) => {
                createTabCallback = func;
            });
        // call show details once
        testSubject.showDetailsView(targetTabId);

        createTabCallback({
            id: detailsViewTabId,
        } as chrome.tabs.Tab);

        browserAdpaterMock.reset();

        // remove details tab
        onTabRemoveCallback(detailsViewTabId, null);

        browserAdpaterMock.setup(adapter => adapter.createTabInNewWindow(It.isAny(), It.isAny())).verifiable(Times.once());

        browserAdpaterMock.setup(adapter => adapter.switchToTab(detailsViewTabId)).verifiable(Times.never());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        browserAdpaterMock.verifyAll();
    });

    test('showDetailsView after random tab removed', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        browserAdpaterMock
            .setup(adapter => adapter.createTabInNewWindow('DetailsView/detailsView.html?tabId=' + targetTabId, It.isAny()))
            .callback((url, func) => {
                createTabCallback = func;
            });

        // call show details once
        testSubject.showDetailsView(targetTabId);

        createTabCallback({
            id: detailsViewTabId,
        } as chrome.tabs.Tab);

        browserAdpaterMock.reset();

        // remove details tab
        onTabRemoveCallback(100, null);

        browserAdpaterMock.setup(adapter => adapter.createTabInNewWindow(It.isAny(), It.isAny())).verifiable(Times.never());

        browserAdpaterMock.setup(adapter => adapter.switchToTab(detailsViewTabId)).verifiable(Times.once());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        browserAdpaterMock.verifyAll();
    });
});
