// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ExtensionDetailsViewController } from 'background/extension-details-view-controller';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { Tabs } from 'webextension-polyfill-ts';

describe('ExtensionDetailsViewController', () => {
    let browserAdapterMock: IMock<BrowserAdapter>;
    let testSubject: ExtensionDetailsViewController;
    let onTabRemoveCallback: (tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => void;
    let onUpdateTabCallback: (
        tabId: number,
        changeInfo: chrome.tabs.TabChangeInfo,
        tab: chrome.tabs.Tab,
    ) => void;

    beforeEach(() => {
        browserAdapterMock = Mock.ofType<BrowserAdapter>(undefined, MockBehavior.Strict);

        browserAdapterMock
            .setup(adapter => adapter.addListenerToTabsOnRemoved(It.isAny()))
            .callback(callback => {
                onTabRemoveCallback = callback;
            })
            .verifiable();

        browserAdapterMock
            .setup(adapter => adapter.addListenerToTabsOnUpdated(It.isAny()))
            .callback(callback => {
                onUpdateTabCallback = callback;
            })
            .verifiable();

        testSubject = new ExtensionDetailsViewController(browserAdapterMock.object);
    });

    describe('showDetailsView', () => {
        it('creates a details view the first time', async () => {
            const targetTabId = 12;
            const detailsViewTabId = 10;

            setupCreateDetailsView(targetTabId, detailsViewTabId).verifiable(Times.once());

            await testSubject.showDetailsView(targetTabId);

            browserAdapterMock.verifyAll();
        });

        it('switch to existing tab the second time', async () => {
            const targetTabId = 5;
            const detailsViewTabId = 10;

            setupCreateDetailsView(targetTabId, detailsViewTabId).verifiable(Times.once());

            await testSubject.showDetailsView(targetTabId);

            browserAdapterMock.reset();

            setupCreateDetailsViewForAnyUrl(Times.never());
            setupSwitchToTab(detailsViewTabId);

            // call show details second time
            await testSubject.showDetailsView(targetTabId);

            browserAdapterMock.verifyAll();
        });

        it('propagates error from failing browser adapter call to switch to tab', async () => {
            const targetTabId = 5;
            const detailsViewTabId = 10;

            setupCreateDetailsView(targetTabId, detailsViewTabId).verifiable(Times.once());

            await testSubject.showDetailsView(targetTabId);

            browserAdapterMock.reset();

            const errorMessage = 'switchToTab failed with dummy error';
            browserAdapterMock
                .setup(adapter => adapter.switchToTab(detailsViewTabId))
                .returns(() => Promise.reject(errorMessage));

            await expect(testSubject.showDetailsView(targetTabId)).rejects.toEqual(errorMessage);

            browserAdapterMock.verifyAll();
        });

        it('propagates error from failing browser adapter call to create tab', async () => {
            const targetTabId = 5;
            const errorMessage = 'error creating new window (from browser adapter)';

            browserAdapterMock
                .setup(adapter =>
                    adapter.createTabInNewWindow(
                        '/DetailsView/detailsView.html?tabId=' + targetTabId,
                    ),
                )
                .returns(() => Promise.reject(errorMessage))
                .verifiable(Times.once());

            await expect(testSubject.showDetailsView(targetTabId)).rejects.toEqual(errorMessage);

            browserAdapterMock.verifyAll();
        });
    });

    test('showDetailsView after target tab updated', async () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;

        setupCreateDetailsView(targetTabId, detailsViewTabId);

        // call show details once
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.reset();

        // update target tab
        onUpdateTabCallback(targetTabId, null, null);

        setupCreateDetailsViewForAnyUrl(Times.never());
        setupSwitchToTab(detailsViewTabId);

        // call show details second time
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.verifyAll();
    });

    test('showDetailsView after details tab navigated to another page', async () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;

        const detailsViewRemovedHandlerMock = Mock.ofInstance((tabId: number) => {});
        detailsViewRemovedHandlerMock
            .setup(handler => handler(targetTabId))
            .verifiable(Times.once());

        testSubject.setupDetailsViewTabRemovedHandler(detailsViewRemovedHandlerMock.object);

        setupCreateDetailsView(targetTabId, detailsViewTabId);

        // call show details once
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.reset();

        // update details tab
        browserAdapterMock
            .setup(adapter => adapter.getUrl(It.isAny()))
            .returns(suffix => `browser://mock_ext_id${suffix}`);

        onUpdateTabCallback(
            detailsViewTabId,
            { url: 'www.bing.com/DetailsView/detailsView.html?tabId=' + targetTabId },
            null,
        );

        setupCreateDetailsViewForAnyUrl(Times.once());

        // call show details second time
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.verifyAll();
        detailsViewRemovedHandlerMock.verifyAll();
    });

    test('showDetailsView after details tab navigated to different details page', async () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;

        setupCreateDetailsView(targetTabId, detailsViewTabId);

        // call show details once
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.reset();

        // update details tab
        browserAdapterMock
            .setup(adapter => adapter.getUrl(It.isAny()))
            .returns(suffix => `browser://mock_ext_id${suffix}`);

        onUpdateTabCallback(
            detailsViewTabId,
            { url: 'chromeExt://ext_id/DetailsView/detailsView.html?tabId=90' },
            null,
        );

        setupCreateDetailsViewForAnyUrl(Times.once());

        // call show details second time
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.verifyAll();
    });

    test('showDetailsView after details tab refresh', async () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;

        setupCreateDetailsView(targetTabId, detailsViewTabId);

        // call show details once
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.reset();

        // update details tab
        browserAdapterMock
            .setup(adapter => adapter.getUrl(It.isAny()))
            .returns(suffix => `browser://mock_ext_id${suffix}`);

        onUpdateTabCallback(
            detailsViewTabId,
            { url: 'browser://MOCK_EXT_ID/detailsView/detailsView.html?tabId=' + targetTabId },
            null,
        );

        setupCreateDetailsViewForAnyUrl(Times.never());
        setupSwitchToTab(detailsViewTabId);

        // call show details second time
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.verifyAll();
    });

    test('showDetailsView after details tab has # at end', async () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;

        setupCreateDetailsView(targetTabId, detailsViewTabId);

        // call show details once
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.reset();

        // update details tab
        browserAdapterMock
            .setup(adapter => adapter.getUrl(It.isAny()))
            .returns(suffix => `browser://mock_ext_id${suffix}`);

        onUpdateTabCallback(
            detailsViewTabId,
            {
                url:
                    'browser://MOCK_EXT_ID/detailsView/detailsView.html?tabId=' + targetTabId + '#',
            },
            null,
        );

        setupCreateDetailsViewForAnyUrl(Times.never());
        setupSwitchToTab(detailsViewTabId);

        // call show details second time
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.verifyAll();
    });

    test('showDetailsView after details tab title update', async () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;

        setupCreateDetailsView(targetTabId, detailsViewTabId);

        // call show details once
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.reset();

        // update details tab
        onUpdateTabCallback(detailsViewTabId, { title: 'issues' }, null);

        setupCreateDetailsViewForAnyUrl(Times.never());
        setupSwitchToTab(detailsViewTabId);

        // call show details second time
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.verifyAll();
    });

    test('showDetailsView after random tab updated', async () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;

        setupCreateDetailsView(targetTabId, detailsViewTabId);

        // call show details once
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.reset();

        // remove details tab
        onUpdateTabCallback(123, { title: 'issues' }, null);

        setupCreateDetailsViewForAnyUrl(Times.never());
        setupSwitchToTab(detailsViewTabId);

        // call show details second time
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.verifyAll();
    });

    test('showDetailsView after target tab removed', async () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;

        setupCreateDetailsView(targetTabId, detailsViewTabId);

        // call show details once
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.reset();

        // remove target tab
        onTabRemoveCallback(targetTabId, null);

        setupCreateDetailsViewForAnyUrl(Times.once());

        // call show details second time
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.verifyAll();
    });

    test('showDetailsView after details tab removed', async () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;

        setupCreateDetailsView(targetTabId, detailsViewTabId);

        const detailsViewRemovedHandlerMock = Mock.ofInstance((tabId: number) => {});
        detailsViewRemovedHandlerMock
            .setup(handler => handler(targetTabId))
            .verifiable(Times.once());
        testSubject.setupDetailsViewTabRemovedHandler(detailsViewRemovedHandlerMock.object);

        // call show details once
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.reset();

        // remove details tab
        onTabRemoveCallback(detailsViewTabId, null);

        setupCreateDetailsViewForAnyUrl(Times.once());

        // call show details second time
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.verifyAll();
        detailsViewRemovedHandlerMock.verifyAll();
    });

    test('showDetailsView after details tab removed, remove handler not set', async () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;

        setupCreateDetailsView(targetTabId, detailsViewTabId);

        // call show details once
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.reset();

        // remove details tab
        onTabRemoveCallback(detailsViewTabId, null);

        setupCreateDetailsViewForAnyUrl(Times.once());

        // call show details second time
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.verifyAll();
    });

    test('showDetailsView after random tab removed', async () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;

        setupCreateDetailsView(targetTabId, detailsViewTabId);

        // call show details once
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.reset();

        // remove details tab
        onTabRemoveCallback(100, null);

        setupCreateDetailsViewForAnyUrl(Times.never());
        setupSwitchToTab(detailsViewTabId);

        // call show details second time
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.verifyAll();
    });

    const setupSwitchToTab = (tabId: number) => {
        return browserAdapterMock
            .setup(adapter => adapter.switchToTab(tabId))
            .returns(() => Promise.resolve());
    };

    const setupCreateDetailsView = (targetTabId: number, resultingDetailsViewTabId: number) => {
        return browserAdapterMock
            .setup(adapter =>
                adapter.createTabInNewWindow('/DetailsView/detailsView.html?tabId=' + targetTabId),
            )
            .returns(() => Promise.resolve({ id: resultingDetailsViewTabId } as Tabs.Tab));
    };

    const setupCreateDetailsViewForAnyUrl = (times: Times) => {
        browserAdapterMock
            .setup(adapter => adapter.createTabInNewWindow(It.isAny()))
            .returns(() => Promise.resolve({ id: -1 } as Tabs.Tab))
            .verifiable(times);
    };
});
