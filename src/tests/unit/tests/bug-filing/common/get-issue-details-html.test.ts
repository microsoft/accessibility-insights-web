// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { repeat } from 'lodash';
import { IMock, Mock } from 'typemoq';
import { getIssueDetailsHtml } from '../../../../../bug-filing/common/get-issue-details-html';
import { IssueUrlCreationUtils } from '../../../../../bug-filing/common/issue-filing-url-string-utils';
import { EnvironmentInfo } from '../../../../../common/environment-info-provider';
import { CreateIssueDetailsTextData } from '../../../../../common/types/create-issue-details-text-data';
import { DecoratedAxeNodeResult } from '../../../../../injected/scanner-utils';

describe('getIssueDetailsHtml', () => {
    let stringUtilsMock: IMock<IssueUrlCreationUtils>;

    let sampleIssueDetailsData: CreateIssueDetailsTextData;

    const environmentInfo: EnvironmentInfo = {
        extensionVersion: '1.1.1',
        axeCoreVersion: '2.2.2',
        browserSpec: 'test spec',
    };

    const testObject = getIssueDetailsHtml;

    beforeEach(() => {
        stringUtilsMock = Mock.ofType<IssueUrlCreationUtils>();
        stringUtilsMock.setup(utils => utils.getFooter(environmentInfo)).returns(() => 'test footer content');
        sampleIssueDetailsData = {
            pageTitle: 'pageTitle<x>',
            pageUrl: 'pageUrl',
            ruleResult: {
                failureSummary: 'RR-failureSummary',
                guidanceLinks: [{ text: 'WCAG-1.4.1' }, { text: 'wcag-2.8.2' }],
                help: 'RR-help',
                html: 'RR-html',
                ruleId: 'RR-rule-id',
                helpUrl: 'RR help url',
                selector: 'RR-selector<x>',
                snippet: 'RR-snippet   space',
            } as DecoratedAxeNodeResult,
        };
    });

    it('returns issue details text as html', () => {
        const result = testObject(stringUtilsMock.object, environmentInfo, sampleIssueDetailsData);

        expect(result).toMatchSnapshot();
    });

    it('truncates long snippets', () => {
        sampleIssueDetailsData.ruleResult.html = `${repeat('-', 300)}end-of-html`;

        const result = testObject(stringUtilsMock.object, environmentInfo, sampleIssueDetailsData);

        expect(result).not.toContain('end-of-html');
        expect(result).toContain('...');
        expect(result).toMatchSnapshot();
    });
});
