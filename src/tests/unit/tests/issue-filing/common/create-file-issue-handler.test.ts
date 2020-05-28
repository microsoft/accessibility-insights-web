// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { CreateIssueDetailsTextData } from 'common/types/create-issue-details-text-data';
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { IssueFilingServicePropertiesMap } from 'common/types/store-data/user-configuration-store';
import { createFileIssueHandler } from 'issue-filing/common/create-file-issue-handler';
import { IssueFilingUrlProvider } from 'issue-filing/types/issue-filing-service';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';
import { Tabs } from 'webextension-polyfill-ts';

describe('createFileIssueHandler', () => {
    const serviceMap: IssueFilingServicePropertiesMap = {};
    const issueData: CreateIssueDetailsTextData = {
        targetApp: {
            name: 'pageTitle<x>',
        },
    } as CreateIssueDetailsTextData;
    const toolData: ToolData = {
        scanEngineProperties: {
            name: 'engine-name',
            version: 'engine-version',
        },
        applicationProperties: {
            name: 'app-name',
            version: 'app-version',
            environmentName: 'environmentName',
        },
    };
    const settingsStub = {
        repo: 'test-repo',
    };
    const urlStub = 'url-stub';

    let settingsGetterMock: IMock<(data: IssueFilingServicePropertiesMap) => any>;
    let urlProviderMock: IMock<IssueFilingUrlProvider<any>>;
    let browserAdapterMock: IMock<BrowserAdapter>;

    beforeEach(() => {
        settingsGetterMock = Mock.ofType<(data: IssueFilingServicePropertiesMap) => any>(
            undefined,
            MockBehavior.Strict,
        );
        settingsGetterMock.setup(getter => getter(serviceMap)).returns(() => settingsStub);

        urlProviderMock = Mock.ofType<IssueFilingUrlProvider<any>>(undefined, MockBehavior.Strict);
        urlProviderMock
            .setup(provider => provider(settingsStub, issueData, toolData))
            .returns(() => urlStub);

        browserAdapterMock = Mock.ofType<BrowserAdapter>(undefined, MockBehavior.Strict);
    });

    it('properly files an issue', async () => {
        browserAdapterMock
            .setup(adapter => adapter.createActiveTab(urlStub))
            .returns(() => Promise.resolve({} as Tabs.Tab))
            .verifiable(Times.once());

        const testSubject = createFileIssueHandler(
            urlProviderMock.object,
            settingsGetterMock.object,
        );

        await expect(
            testSubject(browserAdapterMock.object.createActiveTab, serviceMap, issueData, toolData),
        ).resolves.toBe(undefined);

        browserAdapterMock.verifyAll();
    });

    it('properly surfaces errors', async () => {
        const errorMessage = 'dummy error';

        browserAdapterMock
            .setup(adapter => adapter.createActiveTab(urlStub))
            .returns(() => Promise.reject(errorMessage));

        const testSubject = createFileIssueHandler(
            urlProviderMock.object,
            settingsGetterMock.object,
        );

        await expect(
            testSubject(browserAdapterMock.object.createActiveTab, serviceMap, issueData, toolData),
        ).rejects.toEqual(errorMessage);
    });
});
