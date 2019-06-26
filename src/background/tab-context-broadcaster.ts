// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { StoreUpdateMessage } from '../common/types/store-update-message';

export class TabContextBroadcaster {
    private _sendMessageToFramesAndTab: (tabId: number, message: any) => void;

    constructor(sendMessageToFramesAndTabDelegate: (tabId: number, message: any) => void) {
        this._sendMessageToFramesAndTab = sendMessageToFramesAndTabDelegate;
    }

    public getBroadcastMessageDelegate = (tabId): ((message: StoreUpdateMessage<any>) => void) => {
        return message => {
            message.tabId = tabId;
            this._sendMessageToFramesAndTab(tabId, message);
        };
    };
}
