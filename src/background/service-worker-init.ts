// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const state = {
    count: 0,
    interval: 0,
};

chrome.action.onClicked.addListener(onClicked);
chrome.runtime.onInstalled.addListener(onInstalled);

function onInstalled() {
    state.interval = Math.ceil(5 * Math.random());
    console.log(`interval = ${state.interval}`);
}

function onClicked() {
    console.log(`count = ${state.count}`);
    state.count += state.interval;
}
