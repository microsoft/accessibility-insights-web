// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock } from 'typemoq';
import { getIssueDetailsMarkdown } from '../../../../../bug-filing/common/get-issue-details-markdown';
import { IssueUrlCreationUtils } from '../../../../../bug-filing/common/issue-filing-url-string-utils';
import { EnvironmentInfo } from '../../../../../common/environment-info-provider';

describe('getIssueDetailsMarkdown', () => {
    let stringUtilsMock: IMock<IssueUrlCreationUtils>;
    const sampleIssueDetailsData = {
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
        } as any,
    };
    const environmentInfo: EnvironmentInfo = {
        extensionVersion: '1.1.1',
        axeCoreVersion: '2.2.2',
        browserSpec: 'test spec',
    };
    const testObject = getIssueDetailsMarkdown;

    beforeEach(() => {
        stringUtilsMock = Mock.ofType<IssueUrlCreationUtils>();
    });

    it('returns issue details text as markdown', () => {
        stringUtilsMock.setup(utils => utils.collapseConsecutiveSpaces(It.isAnyString())).returns(() => 'collapsed');
        stringUtilsMock.setup(utils => utils.formatAsMarkdownCodeBlock(It.isAnyString())).returns(() => 'escaped');
        stringUtilsMock.setup(utils => utils.getFooterContent(environmentInfo)).returns(() => 'test footer content');

        const result = testObject(stringUtilsMock.object, environmentInfo, sampleIssueDetailsData);

        expect(result).toMatchSnapshot();
    });
});
