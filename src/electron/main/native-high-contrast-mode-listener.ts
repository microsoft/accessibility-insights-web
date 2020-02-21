// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NativeTheme } from 'electron';
import { NativeHighContrastModeChangedMessage } from 'electron/main/ipc-message-dispatcher';

export class NativeHighContrastModeListener {
    private lastHighContrastUpdate: boolean;

    public constructor(
        private readonly nativeTheme: NativeTheme,
        private readonly onHighContrastModeChanged: (
            message: NativeHighContrastModeChangedMessage,
        ) => void,
    ) {}

    public startListening = (): void => {
        this.nativeTheme.on('updated', this.onNativeThemeUpdated);
        this.notifyHighContrastModeChanged();
    };

    public stopListening = (): void => {
        this.nativeTheme.removeListener('updated', this.onNativeThemeUpdated);
    };

    private notifyHighContrastModeChanged = (): void => {
        this.lastHighContrastUpdate = this.nativeTheme.shouldUseHighContrastColors;
        this.onHighContrastModeChanged({
            id: 'nativeHighContrastModeChanged',
            isHighContrastMode: this.lastHighContrastUpdate,
        });
    };

    private onNativeThemeUpdated = (): void => {
        if (this.lastHighContrastUpdate !== this.nativeTheme.shouldUseHighContrastColors) {
            this.notifyHighContrastModeChanged();
        }
    };
}
