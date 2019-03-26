// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStore } from '../common/base-store';
import { BugActionMessageCreator } from '../common/message-creators/bug-action-message-creator';
import { DevToolActionMessageCreator } from '../common/message-creators/dev-tool-action-message-creator';
import { DevToolState } from '../common/types/store-data/idev-tool-state';
import { UserConfigurationStoreData } from '../common/types/store-data/user-configuration-store';
import { TargetPageActionMessageCreator } from './target-page-action-message-creator';

export class MainWindowContext {
    public constructor(
        private devToolStore: BaseStore<DevToolState>,
        private userConfigStore: BaseStore<UserConfigurationStoreData>,
        private devToolActionMessageCreator: DevToolActionMessageCreator,
        private targetPageActionMessageCreator: TargetPageActionMessageCreator,
        private bugActionMessageCreator: BugActionMessageCreator,
    ) {}

    public getDevToolStore(): BaseStore<DevToolState> {
        return this.devToolStore;
    }

    public getUserConfigStore(): BaseStore<UserConfigurationStoreData> {
        return this.userConfigStore;
    }

    public getDevToolActionMessageCreator(): DevToolActionMessageCreator {
        return this.devToolActionMessageCreator;
    }

    public getTargetPageActionMessageCreator(): TargetPageActionMessageCreator {
        return this.targetPageActionMessageCreator;
    }

    public getBugActionMessageCreator(): BugActionMessageCreator {
        return this.bugActionMessageCreator;
    }

    public static initialize(
        devToolStore: BaseStore<DevToolState>,
        userConfigStore: BaseStore<UserConfigurationStoreData>,
        devToolActionMessageCreator: DevToolActionMessageCreator,
        targetPageActionMessageCreator: TargetPageActionMessageCreator,
        bugActionMessageCreator: BugActionMessageCreator,
    ): void {
        window.mainWindowContext = new MainWindowContext(
            devToolStore,
            userConfigStore,
            devToolActionMessageCreator,
            targetPageActionMessageCreator,
            bugActionMessageCreator,
        );
    }

    public static get(): MainWindowContext {
        return window.mainWindowContext;
    }

    public static getIfNotGiven(given: MainWindowContext): MainWindowContext {
        if (given) {
            return given;
        }
        return MainWindowContext.get();
    }
}
