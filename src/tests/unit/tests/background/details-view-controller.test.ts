// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, Times } from 'typemoq';

import { DetailsViewController } from 'background/details-view-controller';
import { BrowserAdapter } from '../../../../common/browser-adapters/browser-adapter';

describe('DetailsViewControllerTest', () => {
    let mockBrowserAdpater: IMock<BrowserAdapter>;
    let testSubject: DetailsViewController;
    let onTabRemoveCallback: (tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => void;
    let onUpdateTabCallback: (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => void;

    beforeEach(() => {
        mockBrowserAdpater = Mock.ofType<BrowserAdapter>();

        mockBrowserAdpater
            .setup(it => it.addListenerToTabsOnRemoved(It.isAny()))
            .callback(callback => {
                onTabRemoveCallback = callback;
            })
            .verifiable();

        mockBrowserAdpater
            .setup(it => it.addListenerToTabsOnUpdated(It.isAny()))
            .callback(callback => {
                onUpdateTabCallback = callback;
            })
            .verifiable();

        testSubject = new DetailsViewController(mockBrowserAdpater.object);

        mockBrowserAdpater.verifyAll();
        mockBrowserAdpater.reset();
    });

    test('showDetailsView first time', () => {
        const targetTabId = 12;
        const detailsViewTabId = 10;

        mockBrowserAdpater
            .setup(it => it.createTabInNewWindow('DetailsView/detailsView.html?tabId=' + targetTabId, It.isAny()))
            .callback((url, func) => {
                func({
                    id: detailsViewTabId,
                } as chrome.tabs.Tab);
            })
            .verifiable(Times.once());

        testSubject.showDetailsView(targetTabId);

        mockBrowserAdpater.verifyAll();
    });

    test('showDetailsView second time', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        mockBrowserAdpater
            .setup(it => it.createTabInNewWindow('DetailsView/detailsView.html?tabId=' + targetTabId, It.isAny()))
            .callback((url, func) => {
                createTabCallback = func;
            });

        // call show details once
        testSubject.showDetailsView(targetTabId);

        createTabCallback({
            id: detailsViewTabId,
        } as chrome.tabs.Tab);

        mockBrowserAdpater.reset();

        mockBrowserAdpater.setup(it => it.createTabInNewWindow(It.isAny(), It.isAny())).verifiable(Times.never());

        mockBrowserAdpater.setup(it => it.switchToTab(detailsViewTabId)).verifiable(Times.once());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        mockBrowserAdpater.verifyAll();
    });

    test('showDetailsView after target tab updated', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        mockBrowserAdpater
            .setup(it => it.createTabInNewWindow('DetailsView/detailsView.html?tabId=' + targetTabId, It.isAny()))
            .callback((url, func) => {
                createTabCallback = func;
            });

        // call show details once
        testSubject.showDetailsView(targetTabId);

        createTabCallback({
            id: detailsViewTabId,
        } as chrome.tabs.Tab);

        mockBrowserAdpater.reset();

        // update target tab
        onUpdateTabCallback(targetTabId, null, null);

        mockBrowserAdpater.setup(it => it.createTabInNewWindow(It.isAny(), It.isAny())).verifiable(Times.never());

        mockBrowserAdpater.setup(it => it.switchToTab(detailsViewTabId)).verifiable(Times.once());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        mockBrowserAdpater.verifyAll();
    });

    test('showDetailsView after details tab navigated to another page', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        const detailsViewRemovedHandlerMock = Mock.ofInstance((tabId: number) => {});
        detailsViewRemovedHandlerMock.setup(d => d(targetTabId)).verifiable(Times.once());

        testSubject.setupDetailsViewTabRemovedHandler(detailsViewRemovedHandlerMock.object);

        mockBrowserAdpater
            .setup(it => it.createTabInNewWindow('DetailsView/detailsView.html?tabId=' + targetTabId, It.isAny()))
            .callback((url, func) => {
                createTabCallback = func;
            });

        // call show details once
        testSubject.showDetailsView(targetTabId);

        createTabCallback({
            id: detailsViewTabId,
        } as chrome.tabs.Tab);

        mockBrowserAdpater.reset();

        // update details tab
        mockBrowserAdpater
            .setup(it => it.getRunTimeId())
            .returns(() => {
                return 'ext_id';
            });
        onUpdateTabCallback(detailsViewTabId, { url: 'www.bing.com/DetailsView/detailsView.html?tabId=' + targetTabId }, null);

        mockBrowserAdpater.setup(it => it.createTabInNewWindow(It.isAny(), It.isAny())).verifiable(Times.once());

        mockBrowserAdpater.setup(it => it.switchToTab(detailsViewTabId)).verifiable(Times.never());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        mockBrowserAdpater.verifyAll();
        detailsViewRemovedHandlerMock.verifyAll();
    });

    test('showDetailsView after details tab navigated to different details page', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        mockBrowserAdpater
            .setup(it => it.createTabInNewWindow('DetailsView/detailsView.html?tabId=' + targetTabId, It.isAny()))
            .callback((url, func) => {
                createTabCallback = func;
            });

        // call show details once
        testSubject.showDetailsView(targetTabId);

        createTabCallback({
            id: detailsViewTabId,
        } as chrome.tabs.Tab);

        mockBrowserAdpater.reset();

        // update details tab
        const extensionId = 'ext_id';
        mockBrowserAdpater
            .setup(it => it.getRunTimeId())
            .returns(() => {
                return extensionId;
            });
        onUpdateTabCallback(detailsViewTabId, { url: 'chromeExt://ext_id/DetailsView/detailsView.html?tabId=90' }, null);

        mockBrowserAdpater.setup(it => it.createTabInNewWindow(It.isAny(), It.isAny())).verifiable(Times.once());

        mockBrowserAdpater.setup(it => it.switchToTab(detailsViewTabId)).verifiable(Times.never());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        mockBrowserAdpater.verifyAll();
    });

    test('showDetailsView after details tab refresh', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        mockBrowserAdpater
            .setup(it => it.createTabInNewWindow('DetailsView/detailsView.html?tabId=' + targetTabId, It.isAny()))
            .callback((url, func) => {
                createTabCallback = func;
            });

        // call show details once
        testSubject.showDetailsView(targetTabId);

        createTabCallback({
            id: detailsViewTabId,
        } as chrome.tabs.Tab);

        mockBrowserAdpater.reset();

        // update details tab
        const extensionId = 'ext_id';
        mockBrowserAdpater
            .setup(it => it.getRunTimeId())
            .returns(() => {
                return extensionId;
            });
        onUpdateTabCallback(detailsViewTabId, { url: 'chromeExt://ext_Id/detailsView/detailsView.html?tabId=' + targetTabId }, null);

        mockBrowserAdpater.setup(it => it.createTabInNewWindow(It.isAny(), It.isAny())).verifiable(Times.never());

        mockBrowserAdpater.setup(it => it.switchToTab(detailsViewTabId)).verifiable(Times.once());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        mockBrowserAdpater.verifyAll();
    });

    test('showDetailsView after details tab title update', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        mockBrowserAdpater
            .setup(it => it.createTabInNewWindow('DetailsView/detailsView.html?tabId=' + targetTabId, It.isAny()))
            .callback((url, func) => {
                createTabCallback = func;
            });

        // call show details once
        testSubject.showDetailsView(targetTabId);

        createTabCallback({
            id: detailsViewTabId,
        } as chrome.tabs.Tab);

        mockBrowserAdpater.reset();

        // update details tab
        const extensionId = 'ext_id';
        mockBrowserAdpater
            .setup(it => it.getRunTimeId())
            .returns(() => {
                return extensionId;
            });
        onUpdateTabCallback(detailsViewTabId, { title: 'issues' }, null);

        mockBrowserAdpater.setup(it => it.createTabInNewWindow(It.isAny(), It.isAny())).verifiable(Times.never());

        mockBrowserAdpater.setup(it => it.switchToTab(detailsViewTabId)).verifiable(Times.once());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        mockBrowserAdpater.verifyAll();
    });

    test('showDetailsView after random tab updated', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        mockBrowserAdpater
            .setup(it => it.createTabInNewWindow('DetailsView/detailsView.html?tabId=' + targetTabId, It.isAny()))
            .callback((url, func) => {
                createTabCallback = func;
            });

        // call show details once
        testSubject.showDetailsView(targetTabId);

        createTabCallback({
            id: detailsViewTabId,
        } as chrome.tabs.Tab);

        mockBrowserAdpater.reset();

        // remove details tab
        const extensionId = 'ext_id';
        mockBrowserAdpater
            .setup(it => it.getRunTimeId())
            .returns(() => {
                return extensionId;
            });
        onUpdateTabCallback(123, { title: 'issues' }, null);

        mockBrowserAdpater.setup(it => it.createTabInNewWindow(It.isAny(), It.isAny())).verifiable(Times.never());

        mockBrowserAdpater.setup(it => it.switchToTab(detailsViewTabId)).verifiable(Times.once());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        mockBrowserAdpater.verifyAll();
    });

    test('showDetailsView after target tab removed', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        mockBrowserAdpater
            .setup(it => it.createTabInNewWindow('DetailsView/detailsView.html?tabId=' + targetTabId, It.isAny()))
            .callback((url, func) => {
                createTabCallback = func;
            });

        // call show details once
        testSubject.showDetailsView(targetTabId);

        createTabCallback({
            id: detailsViewTabId,
        } as chrome.tabs.Tab);

        mockBrowserAdpater.reset();

        // remove target tab
        onTabRemoveCallback(targetTabId, null);

        mockBrowserAdpater.setup(it => it.createTabInNewWindow(It.isAny(), It.isAny())).verifiable(Times.once());

        mockBrowserAdpater.setup(it => it.switchToTab(detailsViewTabId)).verifiable(Times.never());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        mockBrowserAdpater.verifyAll();
    });

    test('showDetailsView after details tab removed', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        mockBrowserAdpater
            .setup(it => it.createTabInNewWindow('DetailsView/detailsView.html?tabId=' + targetTabId, It.isAny()))
            .callback((url, func) => {
                createTabCallback = func;
            });
        const detailsViewRemovedHandlerMock = Mock.ofInstance((tabId: number) => {});
        detailsViewRemovedHandlerMock.setup(d => d(targetTabId)).verifiable(Times.once());
        testSubject.setupDetailsViewTabRemovedHandler(detailsViewRemovedHandlerMock.object);

        // call show details once
        testSubject.showDetailsView(targetTabId);

        createTabCallback({
            id: detailsViewTabId,
        } as chrome.tabs.Tab);

        mockBrowserAdpater.reset();

        // remove details tab
        onTabRemoveCallback(detailsViewTabId, null);

        mockBrowserAdpater.setup(it => it.createTabInNewWindow(It.isAny(), It.isAny())).verifiable(Times.once());

        mockBrowserAdpater.setup(it => it.switchToTab(detailsViewTabId)).verifiable(Times.never());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        mockBrowserAdpater.verifyAll();
        detailsViewRemovedHandlerMock.verifyAll();
    });

    test('showDetailsView after details tab removed, remove handler not set', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        mockBrowserAdpater
            .setup(it => it.createTabInNewWindow('DetailsView/detailsView.html?tabId=' + targetTabId, It.isAny()))
            .callback((url, func) => {
                createTabCallback = func;
            });
        // call show details once
        testSubject.showDetailsView(targetTabId);

        createTabCallback({
            id: detailsViewTabId,
        } as chrome.tabs.Tab);

        mockBrowserAdpater.reset();

        // remove details tab
        onTabRemoveCallback(detailsViewTabId, null);

        mockBrowserAdpater.setup(it => it.createTabInNewWindow(It.isAny(), It.isAny())).verifiable(Times.once());

        mockBrowserAdpater.setup(it => it.switchToTab(detailsViewTabId)).verifiable(Times.never());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        mockBrowserAdpater.verifyAll();
    });

    test('showDetailsView after random tab removed', () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;
        let createTabCallback: (tab: chrome.tabs.Tab) => void;

        mockBrowserAdpater
            .setup(it => it.createTabInNewWindow('DetailsView/detailsView.html?tabId=' + targetTabId, It.isAny()))
            .callback((url, func) => {
                createTabCallback = func;
            });

        // call show details once
        testSubject.showDetailsView(targetTabId);

        createTabCallback({
            id: detailsViewTabId,
        } as chrome.tabs.Tab);

        mockBrowserAdpater.reset();

        // remove details tab
        onTabRemoveCallback(100, null);

        mockBrowserAdpater.setup(it => it.createTabInNewWindow(It.isAny(), It.isAny())).verifiable(Times.never());

        mockBrowserAdpater.setup(it => it.switchToTab(detailsViewTabId)).verifiable(Times.once());

        // call show details second time
        testSubject.showDetailsView(targetTabId);

        mockBrowserAdpater.verifyAll();
    });
});
