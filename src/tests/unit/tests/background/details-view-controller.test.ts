// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewController } from 'background/details-view-controller';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { IMock, It, Mock, Times } from 'typemoq';
import { Tabs } from 'webextension-polyfill-ts';

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

    describe('showDetailsView', () => {
        it('creates a details view the first time', async () => {
            const targetTabId = 12;
            const detailsViewTabId = 10;

            setupCreateDetailsViewP(targetTabId, detailsViewTabId).verifiable(Times.once());

            await testSubject.showDetailsView(targetTabId);

            mockBrowserAdapter.verifyAll();
        });

        it('switch to existing tab the second time', async () => {
            const targetTabId = 5;
            const detailsViewTabId = 10;

            setupCreateDetailsViewP(targetTabId, detailsViewTabId).verifiable(Times.once());

            await testSubject.showDetailsView(targetTabId);

            mockBrowserAdapter.reset();

            setupCreateDetailsViewPForAnyUrl(Times.never());

            mockBrowserAdapter.setup(adapter => adapter.switchToTab(detailsViewTabId)).verifiable(Times.once());

            // call show details second time
            await testSubject.showDetailsView(targetTabId);

            mockBrowserAdapter.verifyAll();
        });

        it('propagates error from failing browser adapter call', async () => {
            const targetTabId = 5;
            const errorMessage = 'error creating new window (from browser adapter)';

            mockBrowserAdapter
                .setup(adapter => adapter.createTabInNewWindow('DetailsView/detailsView.html?tabId=' + targetTabId))
                .returns(() => Promise.reject(errorMessage))
                .verifiable(Times.once());

            await expect(testSubject.showDetailsView(targetTabId)).rejects.toEqual(errorMessage);

            mockBrowserAdapter.verifyAll();
        });
    });

    test('showDetailsView after target tab updated', async () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;

        setupCreateDetailsViewP(targetTabId, detailsViewTabId);

        // call show details once
        await testSubject.showDetailsView(targetTabId);

        mockBrowserAdapter.reset();

        // update target tab
        onUpdateTabCallback(targetTabId, null, null);

        setupCreateDetailsViewPForAnyUrl(Times.never());

        mockBrowserAdapter.setup(adapter => adapter.switchToTab(detailsViewTabId)).verifiable(Times.once());

        // call show details second time
        await testSubject.showDetailsView(targetTabId);

        mockBrowserAdapter.verifyAll();
    });

    test('showDetailsView after details tab navigated to another page', async () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;

        const detailsViewRemovedHandlerMock = Mock.ofInstance((tabId: number) => {});
        detailsViewRemovedHandlerMock.setup(handler => handler(targetTabId)).verifiable(Times.once());

        testSubject.setupDetailsViewTabRemovedHandler(detailsViewRemovedHandlerMock.object);

        setupCreateDetailsViewP(targetTabId, detailsViewTabId);

        // call show details once
        await testSubject.showDetailsView(targetTabId);

        mockBrowserAdapter.reset();

        // update details tab
        mockBrowserAdapter.setup(adapter => adapter.getRunTimeId()).returns(() => 'ext_id');

        onUpdateTabCallback(detailsViewTabId, { url: 'www.bing.com/DetailsView/detailsView.html?tabId=' + targetTabId }, null);

        setupCreateDetailsViewPForAnyUrl(Times.once());

        mockBrowserAdapter.setup(adapter => adapter.switchToTab(detailsViewTabId)).verifiable(Times.never());

        // call show details second time
        await testSubject.showDetailsView(targetTabId);

        mockBrowserAdapter.verifyAll();
        detailsViewRemovedHandlerMock.verifyAll();
    });

    test('showDetailsView after details tab navigated to different details page', async () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;

        setupCreateDetailsViewP(targetTabId, detailsViewTabId);

        // call show details once
        await testSubject.showDetailsView(targetTabId);

        mockBrowserAdapter.reset();

        // update details tab
        const extensionId = 'ext_id';
        mockBrowserAdapter.setup(adapter => adapter.getRunTimeId()).returns(() => extensionId);
        onUpdateTabCallback(detailsViewTabId, { url: 'chromeExt://ext_id/DetailsView/detailsView.html?tabId=90' }, null);

        setupCreateDetailsViewPForAnyUrl(Times.once());

        mockBrowserAdapter.setup(adapter => adapter.switchToTab(detailsViewTabId)).verifiable(Times.never());

        // call show details second time
        await testSubject.showDetailsView(targetTabId);

        mockBrowserAdapter.verifyAll();
    });

    test('showDetailsView after details tab refresh', async () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;

        setupCreateDetailsViewP(targetTabId, detailsViewTabId);

        // call show details once
        await testSubject.showDetailsView(targetTabId);

        mockBrowserAdapter.reset();

        // update details tab
        const extensionId = 'ext_id';
        mockBrowserAdapter.setup(adapter => adapter.getRunTimeId()).returns(() => extensionId);
        onUpdateTabCallback(detailsViewTabId, { url: 'chromeExt://ext_Id/detailsView/detailsView.html?tabId=' + targetTabId }, null);

        setupCreateDetailsViewPForAnyUrl(Times.never());

        mockBrowserAdapter.setup(adapter => adapter.switchToTab(detailsViewTabId)).verifiable(Times.once());

        // call show details second time
        await testSubject.showDetailsView(targetTabId);

        mockBrowserAdapter.verifyAll();
    });

    test('showDetailsView after details tab title update', async () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;

        setupCreateDetailsViewP(targetTabId, detailsViewTabId);

        // call show details once
        await testSubject.showDetailsView(targetTabId);

        mockBrowserAdapter.reset();

        // update details tab
        const extensionId = 'ext_id';
        mockBrowserAdapter.setup(adapter => adapter.getRunTimeId()).returns(() => extensionId);
        onUpdateTabCallback(detailsViewTabId, { title: 'issues' }, null);

        setupCreateDetailsViewPForAnyUrl(Times.never());

        mockBrowserAdapter.setup(adapter => adapter.switchToTab(detailsViewTabId)).verifiable(Times.once());

        // call show details second time
        await testSubject.showDetailsView(targetTabId);

        mockBrowserAdapter.verifyAll();
    });

    test('showDetailsView after random tab updated', async () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;

        setupCreateDetailsViewP(targetTabId, detailsViewTabId);

        // call show details once
        await testSubject.showDetailsView(targetTabId);

        mockBrowserAdapter.reset();

        // remove details tab
        const extensionId = 'ext_id';
        mockBrowserAdapter.setup(adapter => adapter.getRunTimeId()).returns(() => extensionId);
        onUpdateTabCallback(123, { title: 'issues' }, null);

        setupCreateDetailsViewPForAnyUrl(Times.never());

        mockBrowserAdapter.setup(adapter => adapter.switchToTab(detailsViewTabId)).verifiable(Times.once());

        // call show details second time
        await testSubject.showDetailsView(targetTabId);

        mockBrowserAdapter.verifyAll();
    });

    test('showDetailsView after target tab removed', async () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;

        setupCreateDetailsViewP(targetTabId, detailsViewTabId);

        // call show details once
        await testSubject.showDetailsView(targetTabId);

        mockBrowserAdapter.reset();

        // remove target tab
        onTabRemoveCallback(targetTabId, null);

        setupCreateDetailsViewPForAnyUrl(Times.once());

        mockBrowserAdapter.setup(adapter => adapter.switchToTab(detailsViewTabId)).verifiable(Times.never());

        // call show details second time
        await testSubject.showDetailsView(targetTabId);

        mockBrowserAdapter.verifyAll();
    });

    test('showDetailsView after details tab removed', async () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;

        setupCreateDetailsViewP(targetTabId, detailsViewTabId);

        const detailsViewRemovedHandlerMock = Mock.ofInstance((tabId: number) => {});
        detailsViewRemovedHandlerMock.setup(handler => handler(targetTabId)).verifiable(Times.once());
        testSubject.setupDetailsViewTabRemovedHandler(detailsViewRemovedHandlerMock.object);

        // call show details once
        await testSubject.showDetailsView(targetTabId);

        mockBrowserAdapter.reset();

        // remove details tab
        onTabRemoveCallback(detailsViewTabId, null);

        setupCreateDetailsViewPForAnyUrl(Times.once());

        mockBrowserAdapter.setup(adapter => adapter.switchToTab(detailsViewTabId)).verifiable(Times.never());

        // call show details second time
        await testSubject.showDetailsView(targetTabId);

        mockBrowserAdapter.verifyAll();
        detailsViewRemovedHandlerMock.verifyAll();
    });

    test('showDetailsView after details tab removed, remove handler not set', async () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;

        setupCreateDetailsViewP(targetTabId, detailsViewTabId);

        // call show details once
        await testSubject.showDetailsView(targetTabId);

        mockBrowserAdapter.reset();

        // remove details tab
        onTabRemoveCallback(detailsViewTabId, null);

        setupCreateDetailsViewPForAnyUrl(Times.once());

        mockBrowserAdapter.setup(adapter => adapter.switchToTab(detailsViewTabId)).verifiable(Times.never());

        // call show details second time
        await testSubject.showDetailsView(targetTabId);

        mockBrowserAdapter.verifyAll();
    });

    test('showDetailsView after random tab removed', async () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;

        setupCreateDetailsViewP(targetTabId, detailsViewTabId);

        // call show details once
        await testSubject.showDetailsView(targetTabId);

        mockBrowserAdapter.reset();

        // remove details tab
        onTabRemoveCallback(100, null);

        setupCreateDetailsViewPForAnyUrl(Times.never());

        mockBrowserAdapter.setup(adapter => adapter.switchToTab(detailsViewTabId)).verifiable(Times.once());

        // call show details second time
        await testSubject.showDetailsView(targetTabId);

        mockBrowserAdapter.verifyAll();
    });

    const setupCreateDetailsViewP = (targetTabId: number, resultingDetailsViewTabId: number) => {
        return mockBrowserAdapter
            .setup(adapter => adapter.createTabInNewWindow('DetailsView/detailsView.html?tabId=' + targetTabId))
            .returns(() => Promise.resolve({ id: resultingDetailsViewTabId } as Tabs.Tab));
    };

    const setupCreateDetailsViewPForAnyUrl = (times: Times) => {
        mockBrowserAdapter
            .setup(adapter => adapter.createTabInNewWindow(It.isAny()))
            .returns(() => Promise.resolve({ id: -1 } as Tabs.Tab))
            .verifiable(times);
    };
});
