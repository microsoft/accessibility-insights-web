// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SaveWindowBoundsPayload } from 'background/actions/action-payloads';
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { WindowStateStore } from 'electron/flux/store/window-state-store';
import { IpcRendererShim } from 'electron/ipc/ipc-renderer-shim';
import { WindowStateActionCreator } from '../flux/action-creator/window-state-action-creator';
import { WindowBoundsPayload } from 'electron/flux/action/window-frame-actions-payloads';

export class WindowFrameListener {
    constructor(
        private readonly windowStateActionsCreator: WindowStateActionCreator,
        private readonly ipcRendererShim: IpcRendererShim,
        private readonly userConfigMessageCreator: UserConfigMessageCreator,
        private readonly windowStateStore: WindowStateStore,
    ) {}

    public initialize(): void {
        this.ipcRendererShim.fromBrowserWindowEnterFullScreen.addListener(this.onEnterFullScreen);
        this.ipcRendererShim.fromBrowserWindowMaximize.addListener(this.onMaximize);
        this.ipcRendererShim.fromBrowserWindowUnmaximize.addListener(this.onUnMaximize);
        this.ipcRendererShim.fromBrowserWindowWindowBoundsChanged.addListener(
            this.onWindowBoundsChanged,
        );
    }

    private onMaximize = (): void => {
        this.windowStateActionsCreator.setWindowState({ currentWindowState: 'maximized' });
    };

    private onEnterFullScreen = (): void => {
        this.windowStateActionsCreator.setWindowState({ currentWindowState: 'fullScreen' });
    };

    private onUnMaximize = (): void => {
        this.windowStateActionsCreator.setWindowState({ currentWindowState: 'customSize' });
    };

    private onWindowBoundsChanged = (payload: WindowBoundsPayload): void => {
        if (this.windowStateStore.getState().routeId === 'deviceConnectView') {
            return;
        }

        const actionPayload: SaveWindowBoundsPayload = {
            isMaximized: payload.isMaximized,
            windowBounds: payload.windowBounds,
        };

        this.userConfigMessageCreator.saveWindowBounds(actionPayload);
    };
}
