// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { sortBy } from 'lodash';
import * as Playwright from 'playwright';
import {
    WindowFrameRelationship,
    WindowMessageRecord,
    WindowMessageRecorder,
} from '../window-message-recorder';
import { PageOptions } from './page';
import { TargetPage, targetPageUrl } from './target-page';

export type NestedIframeId = 'top' | 'child' | 'grandchild';

export type NestedIframeWindowMessageRecord = {
    source: NestedIframeId;
    dest: NestedIframeId;
    data: any;
};

// *not* chronological; merely consistent for the same set of messages, ie, appropriate for
// comparison with expect().
export function sortMessages(messages: NestedIframeWindowMessageRecord[]) {
    return sortBy(
        messages,
        m => m.source,
        m => m.dest,
        m => JSON.stringify(m.data),
    );
}

export class NestedIframeTargetPage extends TargetPage {
    public static url = targetPageUrl({
        testResourcePath: 'nested-iframes/top.html',
    });

    public constructor(underlyingPage: Playwright.Page, tabId: number, options?: PageOptions) {
        super(underlyingPage, tabId, options);
    }

    public allFrames(): Playwright.Frame[] {
        return [this.getFrame('top'), this.getFrame('child'), this.getFrame('grandchild')];
    }

    public getFrame(id: NestedIframeId): Playwright.Frame {
        if (id === 'top') {
            return this.underlyingPage.mainFrame();
        }
        if (id === 'child') {
            return this.underlyingPage.mainFrame().childFrames()[0];
        }
        if (id === 'grandchild') {
            return this.underlyingPage.mainFrame().childFrames()[0].childFrames()[0];
        }
    }

    private windowMessageRecorders: { [frameId in NestedIframeId]: WindowMessageRecorder };
    public async resetWindowMessageRecording(): Promise<void> {
        if (this.windowMessageRecorders != null) {
            for (const recorder of Object.values(this.windowMessageRecorders)) {
                await recorder.reset();
            }
        }
        this.windowMessageRecorders = {
            top: await WindowMessageRecorder.create(this.getFrame('top')),
            child: await WindowMessageRecorder.create(this.getFrame('child')),
            grandchild: await WindowMessageRecorder.create(this.getFrame('grandchild')),
        };
    }

    public async getRecordedWindowMessages(): Promise<NestedIframeWindowMessageRecord[]> {
        const translateMessage = (
            dest: NestedIframeId,
            recordedMessage: WindowMessageRecord,
        ): NestedIframeWindowMessageRecord => ({
            source: this.frameFromRelationship(dest, recordedMessage.senderRelationship),
            dest,
            data: recordedMessage.data,
        });

        const translatedMessages = [];
        for (const frameId of ['top', 'child', 'grandchild'] as const) {
            const messages = await this.windowMessageRecorders[frameId].getRecordedMessages();
            translatedMessages.push(...messages.map(m => translateMessage(frameId, m)));
        }

        return translatedMessages;
    }

    // Returns the message record that should be expected in dest as a result
    public async sendWindowPostMessage(
        messageRecord: NestedIframeWindowMessageRecord,
    ): Promise<void> {
        const { source, dest, data } = messageRecord;
        const destRelationshipToSource = this.frameRelationship(source, dest);
        if (destRelationshipToSource === 'unknown') {
            throw new Error("dest is unknown to source; can't postMessage directly");
        }

        await this.getFrame(source).evaluate(
            ({ destRelationshipToSource, data }) => {
                const destWindow = {
                    self: window,
                    top: window.top,
                    parent: window.parent,
                    child: window.frames[0],
                }[destRelationshipToSource];
                destWindow.postMessage(data, '*');
            },
            { destRelationshipToSource, data },
        );
    }

    public frameRelationship(from: NestedIframeId, to: NestedIframeId): WindowFrameRelationship {
        // prettier-ignore
        return (
            (from === to) ? 'self' :
            (from === 'top' && to === 'child')        ? 'child' :
            (from === 'top' && to === 'grandchild')   ? 'unknown' :
            (from === 'child' && to === 'top')        ? 'top' :
            (from === 'child' && to === 'grandchild') ? 'child' :
            (from === 'grandchild' && to === 'top')   ? 'top' :
            (from === 'grandchild' && to === 'child') ? 'parent' :
            'unknown');
    }

    public frameFromRelationship(from: NestedIframeId, relation: WindowFrameRelationship) {
        // prettier-ignore
        const result: NestedIframeId | 'impossible' = (
            (relation === 'self') ? from :
            (relation === 'top') ? 'top' :
            (relation === 'parent') ? (
                (from === 'child') ? 'top' :
                (from === 'grandchild') ? 'child' :
                'impossible'
            ) :
            (relation === 'child') ? (
                (from === 'top') ? 'child' :
                (from === 'child') ? 'grandchild' :
                'impossible'
            ) :
            (relation === 'unknown') ? (
                (from === 'top') ? 'grandchild' :
                'impossible'
            ) :
            'impossible');

        if (result === 'impossible') {
            throw new Error(
                `Test logic error; there is no frame which ${from} would see as ${relation}`,
            );
        }

        return result;
    }
}
