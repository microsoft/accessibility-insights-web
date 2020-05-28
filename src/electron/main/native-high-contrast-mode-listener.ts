// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { NativeTheme } from 'electron';

export class NativeHighContrastModeListener {
    private highContrastStateAtLastNotify: boolean;

    public constructor(
        private readonly nativeTheme: NativeTheme,
        private readonly userConfigMessageCreator: UserConfigMessageCreator,
    ) {}

    public startListening = (): void => {
        this.nativeTheme.on('updated', this.onNativeThemeUpdated);
        this.notifyHighContrastModeChanged();
    };

    public stopListening = (): void => {
        this.nativeTheme.removeListener('updated', this.onNativeThemeUpdated);
    };

    private notifyHighContrastModeChanged = (): void => {
        this.highContrastStateAtLastNotify = this.nativeTheme.shouldUseHighContrastColors;
        this.userConfigMessageCreator.setNativeHighContrastMode(this.highContrastStateAtLastNotify);
    };

    private onNativeThemeUpdated = (): void => {
        if (this.highContrastStateAtLastNotify !== this.nativeTheme.shouldUseHighContrastColors) {
            this.notifyHighContrastModeChanged();
        }
    };
}
