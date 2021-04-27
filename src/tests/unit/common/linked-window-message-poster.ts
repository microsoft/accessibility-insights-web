// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    WindowMessageListener,
    WindowMessagePoster,
} from 'injected/frameCommunicators/browser-backchannel-window-message-poster';

export class LinkedWindowMessagePoster implements WindowMessagePoster {
    public static createLinkedMockPair(): PairOf<LinkedWindowMessagePoster> {
        const first = new LinkedWindowMessagePoster();
        const second = new LinkedWindowMessagePoster();
        first.other = second;
        second.other = first;
        return [first, second];
    }

    public window: Window = {} as Window;
    private other: LinkedWindowMessagePoster;
    private listeners: WindowMessageListener[] = [];

    postMessage(target: Window, message: any): void {
        if (target !== this.other.window) {
            throw new Error(
                'target window unreachable (LinkedWindowMessagePoster not linked to it)',
            );
        }

        for (const listener of this.other.listeners) {
            listener(message, this.window);
        }
    }

    addMessageListener(listener: WindowMessageListener): void {
        this.listeners.push(listener);
    }

    dispose(): void {
        this.listeners = [];
    }
}

export type PairOf<T> = [T, T];
