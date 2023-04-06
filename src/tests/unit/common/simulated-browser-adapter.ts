// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import {
    BrowserMessageHandler,
    BrowserMessageResponse,
} from 'common/browser-adapters/browser-message-handler';
import { isFunction } from 'lodash';
import { IMock, It, Mock } from 'typemoq';
import { Runtime, Tabs, Windows } from 'webextension-polyfill';

// This is a mock BrowserAdapter that maintains simulated state about which "windows" and "tabs"
// exist and which listeners have been registered, and provides a few helper functions to simulate
// certain browser events.
export type SimulatedBrowserAdapter = IMock<BrowserAdapter> & {
    // Tests may modify this state directly; updates will be reflected in the following default mock implementations:
    //   * this.object.getAllWindows
    //   * this.object.getTab
    //   * this.object.tabsQuery
    //
    // Tests are responsible for maintaining self-consistency (ie, ensuring all tabs have corresponding windows)
    windows: chrome.windows.Window[];
    tabs: Tabs.Tab[];

    // These are set directly to whichever listener was last registered in the corresponding this.object.addListener* call
    notifyTabsOnActivated?: (activeInfo: Tabs.OnActivatedActiveInfoType) => void | Promise<void>;
    notifyTabsOnUpdated?: (
        tabId: number,
        changeInfo: Tabs.OnUpdatedChangeInfoType,
        tab: Tabs.Tab,
    ) => void | Promise<void>;
    notifyTabsOnRemoved?: (
        tabId: number,
        removeInfo: Tabs.OnRemovedRemoveInfoType,
    ) => void | Promise<void>;
    notifyWebNavigationUpdated?: (
        details: chrome.webNavigation.WebNavigationFramedCallbackDetails,
    ) => void | Promise<void>;
    notifyWindowsFocusChanged?: (windowId: number) => void | Promise<void>;

    // These simulate real "update"/"activate" events (they update the windows/tabs state and send the notifications)
    updateTab: (tabId: number, changeInfo: Tabs.OnUpdatedChangeInfoType) => void | Promise<void>;
    activateTab: (tab: Tabs.Tab) => void | Promise<void>;

    // This simulates normal browser runtime.onMessage behavior:
    //  - it loops through each listener previously registered with addListenerOnMessage
    //  - if any listener indicates that it handled the message, notify will return that
    //    listener's response and will not call any further listeners
    //  - if no listener indicates that it handled the message, return { messageHandled: false }
    //    after the last listener is done
    notifyOnMessage: (message: any, sender?: Runtime.MessageSender) => BrowserMessageResponse;
};

export function createSimulatedBrowserAdapter(
    tabs?: Tabs.Tab[],
    windows?: chrome.windows.Window[],
): SimulatedBrowserAdapter {
    const mock: Partial<SimulatedBrowserAdapter> & IMock<BrowserAdapter> =
        Mock.ofType<BrowserAdapter>();
    mock.tabs = [...(tabs ?? [])];
    mock.windows = [...(windows ?? [])];
    const messageListeners: BrowserMessageHandler[] = [];
    mock.setup(m => m.addListenerToTabsOnActivated(It.is(isFunction))).callback(
        c => (mock.notifyTabsOnActivated = c),
    );
    mock.setup(m => m.addListenerToTabsOnUpdated(It.is(isFunction))).callback(
        c => (mock.notifyTabsOnUpdated = c),
    );
    mock.setup(m => m.addListenerToTabsOnRemoved(It.is(isFunction))).callback(
        c => (mock.notifyTabsOnRemoved = c),
    );
    mock.setup(m => m.addListenerToWebNavigationUpdated(It.is(isFunction))).callback(
        c => (mock.notifyWebNavigationUpdated = c),
    );
    mock.setup(m => m.addListenerOnWindowsFocusChanged(It.is(isFunction))).callback(
        c => (mock.notifyWindowsFocusChanged = c),
    );
    mock.setup(m => m.addListenerOnRuntimeMessage(It.is(isFunction))).callback(c =>
        messageListeners.push(c),
    );

    mock.setup(m => m.getRuntimeLastError()).returns(() => undefined);
    mock.setup(m => m.getAllWindows(It.isAny())).returns(() =>
        Promise.resolve(mock.windows as Windows.Window[]),
    );
    mock.setup(m => m.getTab(It.isAny())).returns(async tabId => {
        const matchingTabs = mock.tabs!.filter(tab => tab.id === tabId);
        if (matchingTabs.length === 1) {
            return matchingTabs[0];
        } else {
            throw new Error(`Tab with id ${tabId} not found`);
        }
    });

    mock.setup(m => m.tabsQuery(It.isAny())).returns(query => {
        const result = mock.tabs!.filter(
            candidateTab =>
                (query.active == null || query.active === candidateTab.active) &&
                (query.windowId == null || query.windowId === candidateTab.windowId),
        );

        return Promise.resolve(result as Tabs.Tab[]);
    });

    mock.updateTab = async (tabId, changeInfo) => {
        await Promise.all(
            mock
                .tabs!.filter(tab => tab.id === tabId)
                .map(async (tab, index) => {
                    mock.tabs![index] = { ...tab, ...changeInfo };
                    await mock.notifyTabsOnUpdated!(tabId, changeInfo, mock.tabs![index]);
                }),
        );
    };
    mock.activateTab = async tabToActivate => {
        mock.tabs!.filter(tab => tab.windowId === tabToActivate.windowId).forEach((tab, index) => {
            mock.tabs![index] = { ...tab, active: tabToActivate.id === tab.id };
        });
        if (tabToActivate.id != null) {
            await mock.notifyTabsOnActivated!({
                windowId: tabToActivate.windowId,
                tabId: tabToActivate.id,
            });
        }
    };
    mock.notifyOnMessage = (
        message: any,
        sender?: Runtime.MessageSender,
    ): BrowserMessageResponse => {
        for (const listener of messageListeners) {
            const response = listener(message, sender ?? {});
            if (response.messageHandled) {
                return response;
            }
        }
        return { messageHandled: false };
    };

    return mock as SimulatedBrowserAdapter;
}
