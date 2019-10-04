// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Messages } from '../common/messages';
import { TargetAppInfoPayload } from './../background/actions/action-payloads';
import { MessageDelegate } from './analyzers/rule-analyzer';

export class TargetAppInfoSender {
    constructor(private readonly sendMessage: MessageDelegate, private readonly dom: Document) {}

    public send(): void {
        const payload: TargetAppInfoPayload = {
            targetAppInfo: {
                name: this.dom.title,
                url: this.dom.URL,
            },
        };

        this.sendMessage({
            messageType: Messages.TargetAppInfo.Update,
            payload,
        });
    }
}
