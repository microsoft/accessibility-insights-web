// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { It, Mock, MockBehavior, IMock } from 'typemoq';
import { createIssueDetailsBuilder } from '../../../../../bug-filing/common/create-issue-details-builder';
import { MarkupFormatter } from '../../../../../bug-filing/common/markup/markup-formatter';
import { EnvironmentInfo } from '../../../../../common/environment-info-provider';

describe('Name of the group', () => {
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

    let markupMock: IMock<MarkupFormatter>;

    beforeEach(() => {
        markupMock = Mock.ofType<MarkupFormatter>(null, MockBehavior.Strict);

        markupMock.setup(factory => factory.snippet(It.isAnyString())).returns(text => `s-${text}-s`);
        markupMock.setup(factory => factory.link(It.isAnyString(), It.isAnyString())).returns((href, text) => `l-${href}-${text}-l`);
        markupMock.setup(factory => factory.link(It.isAnyString())).returns(href => `l-${href}-l`);
        markupMock.setup(factory => factory.sectionHeader(It.isAnyString())).returns(header => `h-${header}-h`);
        markupMock.setup(factory => factory.howToFixSection(It.isAnyString())).returns(text => `h-t--${text}--h-t`);
    });

    it('build issue details', () => {
        const testSubject = createIssueDetailsBuilder(markupMock.object);

        const result = testSubject(environmentInfo, sampleIssueDetailsData);

        expect(result).toMatchSnapshot();
    });
});
