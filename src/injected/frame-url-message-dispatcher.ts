// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

import { DevToolActionMessageCreator } from '../common/message-creators/dev-tool-action-message-creator';
import { WindowUtils } from '../common/window-utils';
import { FrameUrlFinder, FrameUrlMessage } from './frame-url-finder';
import { FrameCommunicator } from './frameCommunicators/frame-communicator';

export class FrameUrlMessageDispatcher {
    private devToolActionMessageCreator: DevToolActionMessageCreator;
    private frameUrlFinder: FrameUrlFinder;
    private frameCommunicator: FrameCommunicator;
    private windowUtils: WindowUtils;

    constructor(
        devToolActionMessageCreator: DevToolActionMessageCreator,
        frameUrlFinder: FrameUrlFinder,
        frameCommunicator: FrameCommunicator,
    ) {
        this.devToolActionMessageCreator = devToolActionMessageCreator;
        this.frameCommunicator = frameCommunicator;
    }

    public initialize(): void {
        this.frameCommunicator.subscribe(FrameUrlFinder.SetFrameUrlCommand, this.setTargetFrameUrl);
    }

    @autobind
    public setTargetFrameUrl(targetFrameUrlMessage: FrameUrlMessage): void {
        this.devToolActionMessageCreator.setInspectFrameUrl(targetFrameUrlMessage.frameUrl);
    }
}
