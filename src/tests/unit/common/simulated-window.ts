// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { WindowUtils } from 'common/window-utils';
import {
    WindowMessageListener,
    WindowMessagePoster,
} from 'injected/frameCommunicators/browser-backchannel-window-message-poster';
import { isFunction } from 'lodash';
import { IMock, It, Mock } from 'typemoq';

// This is a mock for WindowUtils that maintains simulated state about which
// listeners have been registered, and provides a few helper functions to simulate
// message events.
export type SimulatedWindowUtils = IMock<WindowUtils> & {
    // Tests may modify this state directly; updates will be reflected in the following default mock implementations:
    // * this.object.addEventListener
    // * this.notifyOnMessageEvent

    eventListeners: WindowMessageListener[];

    // This simulates normal window.onmessage behavior:
    //  - it loops through each listener previously registered with addEventListener
    //  - returns response from sending messageEvent to the listener
    //  - if no listener returns a Promise, return undefined after the last listener is done
    notifyOnMessageEvent: (messageEvent: any) => void | Promise<any>;
};

export function createSimulatedWindowUtils(
    messageListeners?: WindowMessageListener[],
): SimulatedWindowUtils {
    const mock: Partial<SimulatedWindowUtils> & IMock<WindowUtils> = Mock.ofType<WindowUtils>();
    mock.eventListeners = [];

    //overrides default WindowUtils.addEventListener (which calls window.addEventListener)
    //to add to eventListeners[]
    mock.setup(m => m.addEventListener(window, 'message', It.is(isFunction), false)).callback(
        (window, command, callback) => mock.eventListeners.push(callback),
    );

    mock.notifyOnMessageEvent = messageEvent => {
        for (const listener of mock.eventListeners) {
            return listener(messageEvent, messageEvent.source);
        }
    };

    return mock as SimulatedWindowUtils;
}

// This is a mock WindowMessagePoster that maintains simulated state about which
// listeners have been registered, and provides a few helper functions to simulate
// message events.
export type SimulatedWindowMessagePoster = IMock<WindowMessagePoster> & {
    messageListeners: WindowMessageListener[];
    notifyOnWindowMessage: (receivedMessage: any, sourceWindow: Window) => void | Promise<void>;
};
export function createSimulatedWindowMessagePoster(): SimulatedWindowMessagePoster {
    // Tests may modify this state directly; updates will be reflected in the following default mock implementations:
    // * this.object.addMessageListener
    // * this.notifyOnWindowMessage
    const mock: Partial<SimulatedWindowMessagePoster> & IMock<WindowMessagePoster> =
        Mock.ofType<WindowMessagePoster>();
    mock.messageListeners = [];

    mock.setup(m => m.addMessageListener(It.is(isFunction))).callback(callback =>
        mock.messageListeners.push(callback),
    );

    // This simulates WindowMessagePoster.onWindowMessage behavior:
    //  - it loops through each listener previously registered with addEventListener
    //  - returns response from sending messageEvent to the listener
    mock.notifyOnWindowMessage = (receivedMessage: any, sourceWindow: Window) => {
        for (const listener of mock.messageListeners) {
            return listener(receivedMessage, sourceWindow);
        }
    };

    return mock as SimulatedWindowMessagePoster;
}
