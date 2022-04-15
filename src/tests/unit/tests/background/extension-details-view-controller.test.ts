// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ExtensionDetailsViewController } from 'background/extension-details-view-controller';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { DictionaryStringTo } from 'types/common-types';
import { Tabs } from 'webextension-polyfill-ts';

describe('ExtensionDetailsViewController', () => {
    let browserAdapterMock: IMock<BrowserAdapter>;
    let testSubject: ExtensionDetailsViewController;
    let onTabRemoveCallback: (tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => void;
    let onUpdateTabCallback: (
        tabId: number,
        changeInfo: chrome.tabs.TabChangeInfo,
        tab: chrome.tabs.Tab,
    ) => Promise<void>;
    let tabIdToDetailsViewMap: DictionaryStringTo<number>;
    const indexedDBDataKey: string = 'tabIdToDetailsViewMap';
    const idbInstanceMock: IMock<IndexedDBAPI> = Mock.ofType<IndexedDBAPI>();

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

        tabIdToDetailsViewMap = {};
        idbInstanceMock.reset();

        testSubject = new ExtensionDetailsViewController(
            browserAdapterMock.object,
            tabIdToDetailsViewMap,
            idbInstanceMock.object,
        );
    });

    describe('showDetailsView', () => {
        it('creates a details view the first time', async () => {
            const targetTabId = 12;
            const detailsViewTabId = 10;

            setupCreateDetailsView(targetTabId, detailsViewTabId).verifiable(Times.once());

            setupDatabaseInstance({ '12': detailsViewTabId }, Times.once());

            await testSubject.showDetailsView(targetTabId);

            browserAdapterMock.verifyAll();
            idbInstanceMock.verifyAll();
        });

        it('creates a details view the first time with persisted items', async () => {
            tabIdToDetailsViewMap['9'] = 99;

            const targetTabId = 12;
            const detailsViewTabId = 10;

            setupCreateDetailsView(targetTabId, detailsViewTabId).verifiable(Times.once());

            setupDatabaseInstance(
                {
                    '12': detailsViewTabId,
                    '9': 99,
                },
                Times.once(),
            );

            await testSubject.showDetailsView(targetTabId);

            browserAdapterMock.verifyAll();
            idbInstanceMock.verifyAll();
        });

        it('switch to existing tab the second time', async () => {
            const targetTabId = 5;
            const detailsViewTabId = 10;

            setupCreateDetailsView(targetTabId, detailsViewTabId).verifiable(Times.once());

            setupDatabaseInstance({ '5': detailsViewTabId }, Times.once());

            await testSubject.showDetailsView(targetTabId);

            browserAdapterMock.reset();

            setupCreateDetailsViewForAnyUrl(Times.never());
            setupSwitchToTab(detailsViewTabId);

            // call show details second time
            await testSubject.showDetailsView(targetTabId);

            browserAdapterMock.verifyAll();
            idbInstanceMock.verifyAll();
        });

        it('propagates error from failing browser adapter call to switch to tab', async () => {
            const targetTabId = 5;
            const detailsViewTabId = 10;

            setupCreateDetailsView(targetTabId, detailsViewTabId).verifiable(Times.once());

            setupDatabaseInstance({ '5': detailsViewTabId }, Times.once());

            await testSubject.showDetailsView(targetTabId);

            browserAdapterMock.reset();

            const errorMessage = 'switchToTab failed with dummy error';
            browserAdapterMock
                .setup(adapter => adapter.switchToTab(detailsViewTabId))
                .returns(() => Promise.reject(errorMessage));

            await expect(testSubject.showDetailsView(targetTabId)).rejects.toEqual(errorMessage);

            browserAdapterMock.verifyAll();
            idbInstanceMock.verifyAll();
        });

        it('propagates error from failing browser adapter call to create tab', async () => {
            const targetTabId = 5;
            const errorMessage = 'error creating new window (from browser adapter)';

            setupDatabaseInstance(null, Times.never());

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
            idbInstanceMock.verifyAll();
        });
    });

    test('showDetailsView after target tab updated', async () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;

        setupCreateDetailsView(targetTabId, detailsViewTabId);

        setupDatabaseInstance({ '5': detailsViewTabId }, Times.once());

        // call show details once
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.reset();

        // update target tab
        await onUpdateTabCallback(targetTabId, null, null);

        setupCreateDetailsViewForAnyUrl(Times.never());
        setupSwitchToTab(detailsViewTabId);

        // call show details second time
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.verifyAll();
        idbInstanceMock.verifyAll();
    });

    test('showDetailsView after details tab navigated to another page', async () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;

        setupDatabaseInstance({ '5': detailsViewTabId }, Times.once());
        setupDatabaseInstance({}, Times.once());
        setupDatabaseInstance({ '5': -1 }, Times.once());

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

        await onUpdateTabCallback(
            detailsViewTabId,
            { url: 'www.bing.com/DetailsView/detailsView.html?tabId=' + targetTabId },
            null,
        );

        setupCreateDetailsViewForAnyUrl(Times.once());

        // call show details second time
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.verifyAll();
        detailsViewRemovedHandlerMock.verifyAll();
        idbInstanceMock.verifyAll();
    });

    test('showDetailsView after details tab navigated to different details page', async () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;

        setupCreateDetailsView(targetTabId, detailsViewTabId);

        setupDatabaseInstance({ '5': detailsViewTabId }, Times.once());
        setupDatabaseInstance({}, Times.once());
        setupDatabaseInstance({ '5': -1 }, Times.once());

        // call show details once
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.reset();

        // update details tab
        browserAdapterMock
            .setup(adapter => adapter.getUrl(It.isAny()))
            .returns(suffix => `browser://mock_ext_id${suffix}`);

        await onUpdateTabCallback(
            detailsViewTabId,
            { url: 'chromeExt://ext_id/DetailsView/detailsView.html?tabId=90' },
            null,
        );

        setupCreateDetailsViewForAnyUrl(Times.once());

        // call show details second time
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.verifyAll();
        idbInstanceMock.verifyAll();
    });

    test('showDetailsView after details tab refresh', async () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;

        setupCreateDetailsView(targetTabId, detailsViewTabId);

        setupDatabaseInstance({ '5': detailsViewTabId }, Times.once());

        // call show details once
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.reset();

        // update details tab
        browserAdapterMock
            .setup(adapter => adapter.getUrl(It.isAny()))
            .returns(suffix => `browser://mock_ext_id${suffix}`);

        await onUpdateTabCallback(
            detailsViewTabId,
            { url: 'browser://MOCK_EXT_ID/detailsView/detailsView.html?tabId=' + targetTabId },
            null,
        );

        setupCreateDetailsViewForAnyUrl(Times.never());
        setupSwitchToTab(detailsViewTabId);

        // call show details second time
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.verifyAll();
        idbInstanceMock.verifyAll();
    });

    test('showDetailsView after details tab has # at end', async () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;

        setupCreateDetailsView(targetTabId, detailsViewTabId);

        setupDatabaseInstance({ '5': detailsViewTabId }, Times.once());

        // call show details once
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.reset();

        // update details tab
        browserAdapterMock
            .setup(adapter => adapter.getUrl(It.isAny()))
            .returns(suffix => `browser://mock_ext_id${suffix}`);

        await onUpdateTabCallback(
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
        idbInstanceMock.verifyAll();
    });

    test('showDetailsView after details tab title update', async () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;

        setupCreateDetailsView(targetTabId, detailsViewTabId);

        setupDatabaseInstance({ '5': detailsViewTabId }, Times.once());

        // call show details once
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.reset();

        // update details tab
        await onUpdateTabCallback(detailsViewTabId, { title: 'issues' }, null);

        setupCreateDetailsViewForAnyUrl(Times.never());
        setupSwitchToTab(detailsViewTabId);

        // call show details second time
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.verifyAll();
        idbInstanceMock.verifyAll();
    });

    test('showDetailsView after random tab updated', async () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;

        setupCreateDetailsView(targetTabId, detailsViewTabId);

        setupDatabaseInstance({ '5': detailsViewTabId }, Times.once());

        // call show details once
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.reset();

        // remove details tab
        await onUpdateTabCallback(123, { title: 'issues' }, null);

        setupCreateDetailsViewForAnyUrl(Times.never());
        setupSwitchToTab(detailsViewTabId);

        // call show details second time
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.verifyAll();
        idbInstanceMock.verifyAll();
    });

    test('showDetailsView after target tab removed', async () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;

        setupCreateDetailsView(targetTabId, detailsViewTabId);

        setupDatabaseInstance({ '5': detailsViewTabId }, Times.once());
        setupDatabaseInstance({}, Times.once());
        setupDatabaseInstance({ '5': -1 }, Times.once());

        // call show details once
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.reset();

        // remove target tab
        onTabRemoveCallback(targetTabId, null);

        setupCreateDetailsViewForAnyUrl(Times.once());

        // call show details second time
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.verifyAll();
        idbInstanceMock.verifyAll();
    });

    test('showDetailsView after details tab removed', async () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;

        setupCreateDetailsView(targetTabId, detailsViewTabId);

        setupDatabaseInstance({ '5': detailsViewTabId }, Times.once());
        setupDatabaseInstance({}, Times.once());
        setupDatabaseInstance({ '5': -1 }, Times.once());

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
        idbInstanceMock.verifyAll();
    });

    test('showDetailsView after details tab removed, remove handler not set', async () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;

        setupCreateDetailsView(targetTabId, detailsViewTabId);

        setupDatabaseInstance({ '5': detailsViewTabId }, Times.once());
        setupDatabaseInstance({}, Times.once());
        setupDatabaseInstance({ '5': -1 }, Times.once());

        // call show details once
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.reset();

        // remove details tab
        onTabRemoveCallback(detailsViewTabId, null);

        setupCreateDetailsViewForAnyUrl(Times.once());

        // call show details second time
        await testSubject.showDetailsView(targetTabId);

        browserAdapterMock.verifyAll();
        idbInstanceMock.verifyAll();
    });

    test('showDetailsView after random tab removed', async () => {
        const targetTabId = 5;
        const detailsViewTabId = 10;

        setupCreateDetailsView(targetTabId, detailsViewTabId);

        setupDatabaseInstance({ '5': detailsViewTabId }, Times.exactly(2));

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
        idbInstanceMock.verifyAll();
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

    const setupDatabaseInstance = (expectedMap: DictionaryStringTo<number>, times: Times) => {
        if (expectedMap) {
            idbInstanceMock
                .setup(db => db.setItem(indexedDBDataKey, expectedMap))
                .returns(() => Promise.resolve(true))
                .verifiable(times);
        } else {
            idbInstanceMock.setup(db => db.setItem(indexedDBDataKey, It.isAny())).verifiable(times);
        }
    };
});
