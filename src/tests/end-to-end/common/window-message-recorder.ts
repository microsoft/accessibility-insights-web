// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Frame } from 'playwright';
import * as uuid from 'uuid';

// this is in priority order, ie, window.top sees itself as 'self', not 'top'
export type WindowFrameRelationship = 'self' | 'top' | 'parent' | 'child' | 'unknown';

export type WindowMessageRecord = {
    data: any;
    senderRelationship: WindowFrameRelationship;
};

export class WindowMessageRecorder {
    private constructor(private readonly frame: Frame, private readonly recorderId: string) {}
    public static async create(frame: Frame) {
        const recorder = new WindowMessageRecorder(frame, uuid.v4());
        await recorder.initialize();
        return recorder;
    }
    private async initialize(): Promise<void> {
        return await this.frame.evaluate<void, string>(recorderId => {
            if (!(window as any).__WindowMessageRecorders) {
                (window as any).__WindowMessageRecorders = {};
            }
            (window as any).__WindowMessageRecorders[recorderId] = { messages: [] };
            window.addEventListener('message', ev => {
                (window as any).__WindowMessageRecorders[recorderId].messages.push({
                    data: ev.data,
                    // prettier-ignore
                    senderRelationship: (
                        ev.source === window ? 'self' :
                        ev.source === window.top ? 'top' :
                        ev.source === window.parent ? 'parent' :
                        Array.from<MessageEventSource>(window.frames).includes(ev.source) ? 'child' :
                        'unknown'),
                });
            });
        }, this.recorderId);
    }
    public async reset() {
        return await this.frame.evaluate<void, string>(recorderId => {
            (window as any).__WindowMessageRecorders[recorderId].messages = [];
        }, this.recorderId);
    }
    public async getRecordedMessages(): Promise<WindowMessageRecord[]> {
        return await this.frame.evaluate<any[], string>(recorderId => {
            return (window as any).__WindowMessageRecorders[recorderId].messages;
        }, this.recorderId);
    }
}
