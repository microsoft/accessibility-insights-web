// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Mock, MockBehavior, Times } from 'typemoq';

import { BrowserAdapter } from '../../../../../common/browser-adapters/browser-adapter';
import { EnvironmentInfo } from '../../../../../common/environment-info-provider';
import { CreateIssueDetailsTextData } from '../../../../../common/types/create-issue-details-text-data';
import { IssueFilingServicePropertiesMap } from '../../../../../common/types/store-data/user-configuration-store';
import { DecoratedAxeNodeResult } from '../../../../../injected/scanner-utils';
import { createFileIssueHandler } from '../../../../../issue-filing/common/create-file-issue-handler';
import { IssueFilingUrlProvider } from '../../../../../issue-filing/types/issue-filing-service';

describe('createFileIssueHandler', () => {
    it('properly files an issue', () => {
        const serviceMap: IssueFilingServicePropertiesMap = {};
        const issueData: CreateIssueDetailsTextData = {
            pageTitle: 'pageTitle<x>',
            pageUrl: 'pageUrl',
            ruleResult: {
                failureSummary: 'RR-failureSummary',
                guidanceLinks: [{ text: 'WCAG-1.4.1' }, { text: 'wcag-2.8.2' }],
                help: 'RR-help',
                html: 'RR-html',
                ruleId: 'RR-rule-id',
                helpUrl: 'RR-help-url',
                selector: 'RR-selector<x>',
                snippet: 'RR-snippet   space',
            } as DecoratedAxeNodeResult,
        };
        const environmentInfoStub: EnvironmentInfo = {
            axeCoreVersion: 'test axe version',
            browserSpec: 'test browser spec',
            extensionVersion: 'test extension version',
        };
        const settingsStub = {
            repo: 'test-repo',
        };
        const urlStub = 'url-stub';

        const settingsGetterMock = Mock.ofType<(data: IssueFilingServicePropertiesMap) => any>(undefined, MockBehavior.Strict);
        settingsGetterMock.setup(getter => getter(serviceMap)).returns(() => settingsStub);

        const urlProviderMock = Mock.ofType<IssueFilingUrlProvider<any>>(undefined, MockBehavior.Strict);
        urlProviderMock.setup(provider => provider(settingsStub, issueData, environmentInfoStub)).returns(() => urlStub);

        const browserAdapterMock = Mock.ofType<BrowserAdapter>(undefined, MockBehavior.Strict);
        browserAdapterMock.setup(adapter => adapter.createTab(urlStub)).verifiable(Times.once());

        const testSubject = createFileIssueHandler(urlProviderMock.object, settingsGetterMock.object);

        testSubject(browserAdapterMock.object, serviceMap, issueData, environmentInfoStub);

        browserAdapterMock.verifyAll();
    });
});
