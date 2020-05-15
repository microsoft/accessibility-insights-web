// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { BaseStore } from '../common/base-store';
import { DevToolActionMessageCreator } from '../common/message-creators/dev-tool-action-message-creator';
import { IssueFilingActionMessageCreator } from '../common/message-creators/issue-filing-action-message-creator';
import { DevToolStoreData } from '../common/types/store-data/dev-tool-store-data';
import { UserConfigurationStoreData } from '../common/types/store-data/user-configuration-store';
import { EnvironmentInfoProvider } from './../common/environment-info-provider';
import { UserConfigMessageCreator } from './../common/message-creators/user-config-message-creator';
import { IssueFilingServiceProvider } from './../issue-filing/issue-filing-service-provider';
import { TargetPageActionMessageCreator } from './target-page-action-message-creator';

export class MainWindowContext {
    public constructor(
        private devToolStore: BaseStore<DevToolStoreData>,
        private userConfigStore: BaseStore<UserConfigurationStoreData>,
        private devToolActionMessageCreator: DevToolActionMessageCreator,
        private targetPageActionMessageCreator: TargetPageActionMessageCreator,
        private issueFilingActionMessageCreator: IssueFilingActionMessageCreator,
        private userConfigMessageCreator: UserConfigMessageCreator,
        private environmentInfoProvider: EnvironmentInfoProvider,
        private toolData: ToolData,
        private issueFilingServiceProvider: IssueFilingServiceProvider,
    ) {}

    public getDevToolStore(): BaseStore<DevToolStoreData> {
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

    public getIssueFilingActionMessageCreator(): IssueFilingActionMessageCreator {
        return this.issueFilingActionMessageCreator;
    }

    public getUserConfigMessageCreator(): UserConfigMessageCreator {
        return this.userConfigMessageCreator;
    }

    public getEnvironmentInfoProvider(): EnvironmentInfoProvider {
        return this.environmentInfoProvider;
    }

    public getToolData(): ToolData {
        return this.toolData;
    }

    public getIssueFilingServiceProvider(): IssueFilingServiceProvider {
        return this.issueFilingServiceProvider;
    }

    public static initialize(
        devToolStore: BaseStore<DevToolStoreData>,
        userConfigStore: BaseStore<UserConfigurationStoreData>,
        devToolActionMessageCreator: DevToolActionMessageCreator,
        targetPageActionMessageCreator: TargetPageActionMessageCreator,
        issueFilingActionMessageCreator: IssueFilingActionMessageCreator,
        userConfigMessageCreator: UserConfigMessageCreator,
        environmentInfoProvider: EnvironmentInfoProvider,
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
            environmentInfoProvider,
            toolData,
            issueFilingServiceProvider,
        );
    }

    public static getMainWindowContext(): MainWindowContext {
        return window.mainWindowContext;
    }

    public static getIfNotGiven(given: MainWindowContext): MainWindowContext {
        if (given) {
            return given;
        }
        return MainWindowContext.getMainWindowContext();
    }
}
