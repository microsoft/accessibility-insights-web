// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ExtensionDetailsViewController } from 'background/extension-details-view-controller';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { InterpreterResponse, Message } from 'common/message';
import { Messages } from 'common/messages';
import { isEmpty } from 'lodash';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { DictionaryStringTo } from 'types/common-types';
import { Tabs } from 'webextension-polyfill';

describe('ExtensionDetailsViewController', () => {
    let browserAdapterMock: IMock<BrowserAdapter>;
    let interpretMessageForTabMock: IMock<(tabId: number, message: Message) => InterpreterResponse>;
    let testSubject: ExtensionDetailsViewController;
    let tabIdToDetailsViewMap: DictionaryStringTo<number>;
    const indexedDBDataKey: string = 'tabIdToDetailsViewMap';
    const idbInstanceMock: IMock<IndexedDBAPI> = Mock.ofType<IndexedDBAPI>();

    beforeEach(() => {
        browserAdapterMock = Mock.ofType<BrowserAdapter>(undefined, MockBehavior.Strict);
        interpretMessageForTabMock = Mock.ofInstance(() => ({
            messageHandled: true,
            result: undefined,
        }));

        tabIdToDetailsViewMap = {};
        idbInstanceMock.reset();
    });

    describe('initialize()', () => {
        const existingBrowserTabs = [{ id: 1 }, { id: 2 }, { id: 3 }] as Tabs.Tab[];

        beforeEach(() => {
            browserAdapterMock.setup(b => b.tabsQuery({})).returns(async () => existingBrowserTabs);
        });

        it('Does nothing when tabIdToDetailsViewMap is empty', async () => {
            interpretMessageForTabMock
                .setup(i => i(It.isAny(), It.isAny()))
                .verifiable(Times.never());
            setupDatabaseInstance(null, Times.never());

            testSubject = createTestSubject();
            await testSubject.initialize();

            expect(isEmpty(tabIdToDetailsViewMap)).toBe(true);
            interpretMessageForTabMock.verifyAll();
            idbInstanceMock.verifyAll();
        });

        it('Does nothing when tabIdToDetailsViewMap only contains tabs still in browser', async () => {
            tabIdToDetailsViewMap['1'] = 2;
            interpretMessageForTabMock
                .setup(i => i(It.isAny(), It.isAny()))
                .verifiable(Times.never());
            setupDatabaseInstance(null, Times.never());

            testSubject = createTestSubject();
            await testSubject.initialize();

            expect(Object.keys(tabIdToDetailsViewMap)).toEqual(['1']);
            expect(tabIdToDetailsViewMap['1']).toBe(2);
            interpretMessageForTabMock.verifyAll();
            idbInstanceMock.verifyAll();
        });

        it('Removes details view tab id if it does not exist in browser with persistData=%s', async () => {
            tabIdToDetailsViewMap['1'] = 2;
            tabIdToDetailsViewMap['3'] = 33;
            interpretMessageForTabMock
                .setup(i =>
                    i(3, {
                        messageType: Messages.Visualizations.DetailsView.Close,
                        payload: null,
                        tabId: 3,
                    }),
                )
                .returns(() => ({ messageHandled: true, result: undefined }))
                .verifiable(Times.once());

            setupDatabaseInstance({ '1': 2 }, Times.once());

            testSubject = createTestSubject();
            await testSubject.initialize();

            expect(Object.keys(tabIdToDetailsViewMap)).toEqual(['1']);
            interpretMessageForTabMock.verifyAll();
            idbInstanceMock.verifyAll();
        });

        it('Removes target tab id if it does not exist in browser with persistData=%s', async () => {
            tabIdToDetailsViewMap['1'] = 2;
            tabIdToDetailsViewMap['33'] = 3;
            interpretMessageForTabMock
                .setup(i => i(It.isAny(), It.isAny()))
                .verifiable(Times.never());

            setupDatabaseInstance({ '1': 2 }, Times.once());

            testSubject = createTestSubject();
            await testSubject.initialize();

            expect(Object.keys(tabIdToDetailsViewMap)).toEqual(['1']);
            interpretMessageForTabMock.verifyAll();
            idbInstanceMock.verifyAll();
        });
    });

    describe('Persisted Data', () => {
        beforeEach(() => {
            testSubject = createTestSubject();
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

                await expect(testSubject.showDetailsView(targetTabId)).rejects.toEqual(
                    errorMessage,
                );

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

                await expect(testSubject.showDetailsView(targetTabId)).rejects.toEqual(
                    errorMessage,
                );

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
            await testSubject.onUpdateTab(targetTabId, null);

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

            interpretMessageForTabMock
                .setup(i =>
                    i(targetTabId, {
                        tabId: targetTabId,
                        payload: null,
                        messageType: Messages.Visualizations.DetailsView.Close,
                    }),
                )
                .returns(() => ({ messageHandled: true, result: undefined }))
                .verifiable();

            setupCreateDetailsView(targetTabId, detailsViewTabId);

            // call show details once
            await testSubject.showDetailsView(targetTabId);

            browserAdapterMock.reset();

            // update details tab
            browserAdapterMock
                .setup(adapter => adapter.getUrl(It.isAny()))
                .returns(suffix => `browser://mock_ext_id${suffix}`);

            await testSubject.onUpdateTab(detailsViewTabId, {
                url: 'www.bing.com/DetailsView/detailsView.html?tabId=' + targetTabId,
            });

            setupCreateDetailsViewForAnyUrl(Times.once());

            // call show details second time
            await testSubject.showDetailsView(targetTabId);

            browserAdapterMock.verifyAll();
            interpretMessageForTabMock.verifyAll();
            idbInstanceMock.verifyAll();
        });

        test('showDetailsView after details tab navigated to different details page', async () => {
            const targetTabId = 5;
            const detailsViewTabId = 10;

            interpretMessageForTabMock
                .setup(i => i(It.isAny(), It.isAny()))
                .returns(() => ({ messageHandled: true, result: undefined }));

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

            await testSubject.onUpdateTab(detailsViewTabId, {
                url: 'chromeExt://ext_id/DetailsView/detailsView.html?tabId=90',
            });

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

            await testSubject.onUpdateTab(detailsViewTabId, {
                url: 'browser://MOCK_EXT_ID/detailsView/detailsView.html?tabId=' + targetTabId,
            });

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

            await testSubject.onUpdateTab(detailsViewTabId, {
                url:
                    'browser://MOCK_EXT_ID/detailsView/detailsView.html?tabId=' + targetTabId + '#',
            });

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
            await testSubject.onUpdateTab(detailsViewTabId, { title: 'issues' });

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
            await testSubject.onUpdateTab(123, { title: 'issues' });

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
            await testSubject.onRemoveTab(targetTabId);

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

            interpretMessageForTabMock
                .setup(i =>
                    i(targetTabId, {
                        tabId: targetTabId,
                        payload: null,
                        messageType: Messages.Visualizations.DetailsView.Close,
                    }),
                )
                .returns(() => ({ messageHandled: true, result: undefined }))
                .verifiable();

            // call show details once
            await testSubject.showDetailsView(targetTabId);

            browserAdapterMock.reset();

            // remove details tab
            await testSubject.onRemoveTab(detailsViewTabId);

            setupCreateDetailsViewForAnyUrl(Times.once());

            // call show details second time
            await testSubject.showDetailsView(targetTabId);

            browserAdapterMock.verifyAll();
            idbInstanceMock.verifyAll();
            interpretMessageForTabMock.verifyAll();
        });

        test('showDetailsView after details tab removed, remove handler not set', async () => {
            const targetTabId = 5;
            const detailsViewTabId = 10;

            interpretMessageForTabMock
                .setup(i => i(It.isAny(), It.isAny()))
                .returns(() => ({ messageHandled: true, result: undefined }));

            setupCreateDetailsView(targetTabId, detailsViewTabId);

            setupDatabaseInstance({ '5': detailsViewTabId }, Times.once());
            setupDatabaseInstance({}, Times.once());
            setupDatabaseInstance({ '5': -1 }, Times.once());

            // call show details once
            await testSubject.showDetailsView(targetTabId);

            browserAdapterMock.reset();

            // remove details tab
            await testSubject.onRemoveTab(detailsViewTabId);

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
            await testSubject.onRemoveTab(100);

            setupCreateDetailsViewForAnyUrl(Times.never());
            setupSwitchToTab(detailsViewTabId);

            // call show details second time
            await testSubject.showDetailsView(targetTabId);

            browserAdapterMock.verifyAll();
            idbInstanceMock.verifyAll();
        });
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

    const createTestSubject = (): ExtensionDetailsViewController => {
        return new ExtensionDetailsViewController(
            browserAdapterMock.object,
            tabIdToDetailsViewMap,
            idbInstanceMock.object,
            interpretMessageForTabMock.object,
        );
    };
});
