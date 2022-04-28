// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ExtensionDetailsViewController } from 'background/extension-details-view-controller';
import { TabEventDistributor } from 'background/tab-event-distributor';
import { TargetPageController } from 'background/target-page-controller';
import {
    createSimulatedBrowserAdapter,
    SimulatedBrowserAdapter,
} from 'tests/unit/common/simulated-browser-adapter';
import { IMock, Mock, MockBehavior } from 'typemoq';

describe(TabEventDistributor, () => {
    const existingWindow = { id: 101 } as chrome.windows.Window;

    const existingActiveTab = {
        id: 1,
        windowId: existingWindow.id,
        active: true,
    } as chrome.tabs.Tab;

    const existingInactiveTab = {
        id: 2,
        windowId: existingWindow.id,
        active: false,
    } as chrome.tabs.Tab;

    const newTab = {
        id: 3,
        windowId: existingWindow.id,
        active: true,
    } as chrome.tabs.Tab;

    let browserAdapterMock: SimulatedBrowserAdapter;
    let targetPageControllerMock: IMock<TargetPageController>;
    let detailsViewControllerMock: IMock<ExtensionDetailsViewController>;

    let testSubject: TabEventDistributor;

    beforeEach(() => {
        browserAdapterMock = createSimulatedBrowserAdapter(
            [existingActiveTab, existingInactiveTab],
            [existingWindow],
        );
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
    });

    it('webNavigationUpdated event', async () => {
        await browserAdapterMock.notifyWebNavigationUpdated({
            frameId: 0,
            tabId: newTab.id,
        } as chrome.webNavigation.WebNavigationFramedCallbackDetails);
    });

    it('tabsOnRemoved event', async () => {
        const removeInfo = {} as chrome.tabs.TabRemoveInfo;
        await browserAdapterMock.notifyTabsOnRemoved(existingActiveTab.id, removeInfo);
    });

    it('onWindowsFocusChanged event', async () => {
        const otherWindowId = 202;
        await browserAdapterMock.notifyWindowsFocusChanged(otherWindowId);
    });

    it('onTabActivated event', async () => {
        await browserAdapterMock.activateTab(existingInactiveTab);
    });

    it('onTabUpdated event', async () => {
        const changeInfo: chrome.tabs.TabChangeInfo = {};
        await browserAdapterMock.updateTab(existingActiveTab.id, changeInfo);
    });
});
