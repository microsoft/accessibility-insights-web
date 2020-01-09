// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DevToolActionMessageCreator } from '../common/message-creators/dev-tool-action-message-creator';
import { FrameUrlFinder, FrameUrlMessage } from './frame-url-finder';
import { FrameCommunicator } from './frameCommunicators/frame-communicator';

export class FrameUrlMessageDispatcher {
    private devToolActionMessageCreator: DevToolActionMessageCreator;
    private frameCommunicator: FrameCommunicator;

    constructor(
        devToolActionMessageCreator: DevToolActionMessageCreator,
        frameCommunicator: FrameCommunicator,
    ) {
        this.devToolActionMessageCreator = devToolActionMessageCreator;
        this.frameCommunicator = frameCommunicator;
    }

    public initialize(): void {
        this.frameCommunicator.subscribe(FrameUrlFinder.SetFrameUrlCommand, this.setTargetFrameUrl);
    }

    public setTargetFrameUrl = (targetFrameUrlMessage: FrameUrlMessage): void => {
        this.devToolActionMessageCreator.setInspectFrameUrl(targetFrameUrlMessage.frameUrl);
    };
}
