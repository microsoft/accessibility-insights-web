// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
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
    tabs: chrome.tabs.Tab[];

    // These are set directly to whichever listener was last registered in the corresponding this.object.addListener* call
    notifyTabsOnActivated?: (activeInfo: chrome.tabs.TabActiveInfo) => void | Promise<void>;
    notifyTabsOnUpdated?: (
        tabId: number,
        changeInfo: chrome.tabs.TabChangeInfo,
        tab: chrome.tabs.Tab,
    ) => void | Promise<void>;
    notifyTabsOnRemoved?: (
        tabId: number,
        removeInfo: chrome.tabs.TabRemoveInfo,
    ) => void | Promise<void>;
    notifyWebNavigationUpdated?: (
        details: chrome.webNavigation.WebNavigationFramedCallbackDetails,
    ) => void | Promise<void>;
    notifyWindowsFocusChanged?: (windowId: number) => void | Promise<void>;

    // These simulate real "update"/"activate" events (they update the windows/tabs state and send the notifications)
    updateTab: (tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => void | Promise<void>;
    activateTab: (tab: chrome.tabs.Tab) => void | Promise<void>;

    // This simulates normal browser runtime.onMessage behavior:
    //  - it loops through each listener previously registered with addListenerOnMessage
    //  - if any listener returns a Promise (as opposed to undefined), notify will return that
    //    response Promise and will not call any further listeners
    //  - if no listener returns a Promise, return undefined after the last listener is done
    notifyOnMessage: (message: any, sender?: Runtime.MessageSender) => void | Promise<any>;
};

type MessageListener = (message: any, sender: Runtime.MessageSender) => void | Promise<any>;

export function createSimulatedBrowserAdapter(
    tabs?: chrome.tabs.Tab[],
    windows?: chrome.windows.Window[],
): SimulatedBrowserAdapter {
    const mock: Partial<SimulatedBrowserAdapter> & IMock<BrowserAdapter> =
        Mock.ofType<BrowserAdapter>();
    mock.tabs = [...(tabs ?? [])];
    mock.windows = [...(windows ?? [])];
    const messageListeners: MessageListener[] = [];
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
    mock.setup(m => m.addListenerOnMessage(It.is(isFunction))).callback(c =>
        messageListeners.push(c),
    );

    mock.setup(m => m.getRuntimeLastError()).returns(() => undefined);
    mock.setup(m => m.getAllWindows(It.isAny())).returns(() =>
        Promise.resolve(mock.windows as Windows.Window[]),
    );
    mock.setup(m => m.getTab(It.isAny(), It.isAny(), It.isAny())).returns(
        (tabId, resolve, reject) => {
            const matchingTabs = mock.tabs!.filter(tab => tab.id === tabId);
            if (matchingTabs.length === 1) {
                resolve(matchingTabs[0]);
            } else if (reject != null) {
                reject();
            }
        },
    );

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
    mock.notifyOnMessage = (message: any, sender?: Runtime.MessageSender) => {
        for (const listener of messageListeners) {
            const maybePromise = listener(message, sender ?? {});
            if (maybePromise !== undefined) {
                return maybePromise;
            }
        }
    };

    return mock as SimulatedBrowserAdapter;
}
