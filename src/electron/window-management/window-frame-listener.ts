// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { BrowserWindow } from 'electron';
import { WindowStateStore } from 'electron/flux/store/window-state-store';
import { WindowStateActionCreator } from '../flux/action-creator/window-state-action-creator';

export class WindowFrameListener {
    constructor(
        private readonly windowStateActionsCreator: WindowStateActionCreator,
        private readonly browserWindow: BrowserWindow,
        private readonly userConfigMessageCreator: UserConfigMessageCreator,
        private readonly windowStateStore: WindowStateStore,
    ) {}

    public initialize(): void {
        this.browserWindow.on('maximize', this.onMaximize);
        this.browserWindow.on('unmaximize', this.onUnMaximize);
        this.browserWindow.on('enter-full-screen', this.onEnterFullScreen);
        this.browserWindow.on('leave-full-screen', this.onLeaveFullScreen);
        this.browserWindow.on('resize', this.onResize);
    }
    private onMaximize = (): void => {
        this.windowStateActionsCreator.setWindowState({ currentWindowState: 'maximized' });
    };

    private onEnterFullScreen = (): void => {
        this.windowStateActionsCreator.setWindowState({ currentWindowState: 'fullScreen' });
    };
    private onLeaveFullScreen = (): void => {
        if (this.browserWindow.isMaximized()) {
            this.onMaximize();
        } else {
            this.onUnMaximize();
        }
    };
    private onUnMaximize = (): void => {
        this.windowStateActionsCreator.setWindowState({ currentWindowState: 'customSize' });
    };

    private onResize = (): void => {
        if (this.windowStateStore.getState().routeId === 'deviceConnectView') {
            return;
        }

        const size: number[] = this.browserWindow.getSize();
        const payload = { width: size[0], height: size[1] };

        this.userConfigMessageCreator.saveLastWindowSize(payload);
    };
}
