// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ExtensionDetailsViewController } from 'background/extension-details-view-controller';
import { TabEventDistributor } from 'background/tab-event-distributor';
import { TargetPageController } from 'background/target-page-controller';
import {
    createSimulatedBrowserAdapter,
    SimulatedBrowserAdapter,
} from 'tests/unit/common/simulated-browser-adapter';
import { IMock, It, Mock, MockBehavior } from 'typemoq';
import type { Tabs } from 'webextension-polyfill';

describe(TabEventDistributor, () => {
    const tab = {
        id: 1,
        windowId: 101,
    } as Tabs.Tab;

    let browserAdapterMock: SimulatedBrowserAdapter;
    let targetPageControllerMock: IMock<TargetPageController>;
    let detailsViewControllerMock: IMock<ExtensionDetailsViewController>;

    let testSubject: TabEventDistributor;

    beforeEach(() => {
        browserAdapterMock = createSimulatedBrowserAdapter([tab], []);
        targetPageControllerMock = Mock.ofType(TargetPageController, MockBehavior.Strict);
        detailsViewControllerMock = Mock.ofType(
            ExtensionDetailsViewController,
            MockBehavior.Strict,
        );

        testSubject = new TabEventDistributor(
            browserAdapterMock.object,
            targetPageControllerMock.object,
            detailsViewControllerMock.object,
        );

        testSubject.initialize();
    });

    afterEach(() => {
        targetPageControllerMock.verifyAll();
        detailsViewControllerMock.verifyAll();
    });

    it('webNavigationUpdated event', async () => {
        const navigationDetails = {
            frameId: 0,
            tabId: tab.id,
        } as chrome.webNavigation.WebNavigationFramedCallbackDetails;

        targetPageControllerMock.setup(t => t.onTabNavigated(navigationDetails)).verifiable();

        await browserAdapterMock.notifyWebNavigationUpdated(navigationDetails);
    });

    it('tabsOnRemoved event', async () => {
        targetPageControllerMock.setup(t => t.onTargetTabRemoved(tab.id)).verifiable();
        detailsViewControllerMock.setup(d => d.onRemoveTab(tab.id)).verifiable();

        await browserAdapterMock.notifyTabsOnRemoved(tab.id, {} as Tabs.OnRemovedRemoveInfoType);
    });

    it('onWindowsFocusChanged event', async () => {
        targetPageControllerMock.setup(t => t.onWindowFocusChanged()).verifiable();

        await browserAdapterMock.notifyWindowsFocusChanged(tab.windowId);
    });

    it('onTabActivated event', async () => {
        targetPageControllerMock
            .setup(t =>
                t.onTabActivated(It.isObjectWith({ tabId: tab.id, windowId: tab.windowId })),
            )
            .verifiable();

        await browserAdapterMock.activateTab(tab);
    });

    it('onTabUpdated event', async () => {
        const changeInfo: Tabs.OnUpdatedChangeInfoType = {};

        targetPageControllerMock.setup(t => t.onTabUpdated(tab.id, changeInfo)).verifiable();
        detailsViewControllerMock.setup(d => d.onUpdateTab(tab.id, changeInfo)).verifiable();

        await browserAdapterMock.updateTab(tab.id, changeInfo);
    });
});
