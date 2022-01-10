// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

chrome.action.onClicked.addListener(onClicked);
chrome.runtime.onInstalled.addListener(onInstalled);
chrome.storage.onChanged.addListener(onStorageChanged);

function onInstalled() {
    chrome.storage.local.set({ interval: Math.ceil(5 * Math.random()), count: 0 });
}

function onClicked() {
    chrome.storage.local.get(['count', 'interval']).then(({ count, interval }) => {
        chrome.storage.local.set({ count: count + interval });
    });
}

function onStorageChanged(changes: { [key: string]: any }, namespace: string) {
    console.log(changes, namespace);
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        console.log(
            `key ${key} in namespace ${namespace} had value changed from ${oldValue} to ${newValue}`,
        );
    }
}
