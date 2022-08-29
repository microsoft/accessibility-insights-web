// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStore } from 'common/base-store';
import { DevToolActionMessageCreator } from 'common/message-creators/dev-tool-action-message-creator';
import { IssueFilingActionMessageCreator } from 'common/message-creators/issue-filing-action-message-creator';
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { DevToolStoreData } from 'common/types/store-data/dev-tool-store-data';
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { IssueFilingServiceProvider } from 'issue-filing/issue-filing-service-provider';
import { TargetPageActionMessageCreator } from './target-page-action-message-creator';

export class MainWindowContext {
    public constructor(
        private devToolStore: BaseStore<DevToolStoreData, Promise<void>>,
        private userConfigStore: BaseStore<UserConfigurationStoreData, Promise<void>>,
        private devToolActionMessageCreator: DevToolActionMessageCreator,
        private targetPageActionMessageCreator: TargetPageActionMessageCreator,
        private issueFilingActionMessageCreator: IssueFilingActionMessageCreator,
        private userConfigMessageCreator: UserConfigMessageCreator,
        private toolData: ToolData,
        private issueFilingServiceProvider: IssueFilingServiceProvider,
    ) {}

    public getDevToolStore(): BaseStore<DevToolStoreData, Promise<void>> {
        return this.devToolStore;
    }

    public getUserConfigStore(): BaseStore<UserConfigurationStoreData, Promise<void>> {
        return this.userConfigStore;
    }

    public getDevToolActionMessageCreator(): DevToolActionMessageCreator {
        return this.devToolActionMessageCreator;
    }

    public getTargetPageActionMessageCreator(): TargetPageActionMessageCreator {
        return this.targetPageActionMessageCreator;
    }

    public getIssueFilingActionMessageCreator(): IssueFilingActionMessageCreator {
        return this.issueFilingActionMessageCreator;
    }

    public getUserConfigMessageCreator(): UserConfigMessageCreator {
        return this.userConfigMessageCreator;
    }

    public getToolData(): ToolData {
        return this.toolData;
    }

    public getIssueFilingServiceProvider(): IssueFilingServiceProvider {
        return this.issueFilingServiceProvider;
    }

    public static initialize(
        devToolStore: BaseStore<DevToolStoreData, Promise<void>>,
        userConfigStore: BaseStore<UserConfigurationStoreData, Promise<void>>,
        devToolActionMessageCreator: DevToolActionMessageCreator,
        targetPageActionMessageCreator: TargetPageActionMessageCreator,
        issueFilingActionMessageCreator: IssueFilingActionMessageCreator,
        userConfigMessageCreator: UserConfigMessageCreator,
        toolData: ToolData,
        issueFilingServiceProvider: IssueFilingServiceProvider,
    ): void {
        window.mainWindowContext = new MainWindowContext(
            devToolStore,
            userConfigStore,
            devToolActionMessageCreator,
            targetPageActionMessageCreator,
            issueFilingActionMessageCreator,
            userConfigMessageCreator,
            toolData,
            issueFilingServiceProvider,
        );
    }

    public static fromWindow(windowObj: Window): MainWindowContext {
        if (windowObj.mainWindowContext == null) {
            throw new Error('No window.mainWindowContext found');
        }
        return windowObj.mainWindowContext;
    }
}
