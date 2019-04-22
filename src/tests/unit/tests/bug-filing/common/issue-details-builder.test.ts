// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EnvironmentInfo } from '../../../../../common/environment-info-provider';
import { Mock, It, MockBehavior } from 'typemoq';
import { IssueDetailsBuilder } from '../../../../../bug-filing/common/issue-details-builder';
import { MarkupFactory } from '../../../../../bug-filing/common/markup-factory';

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

    let markupMock = Mock.ofType<MarkupFactory>(null, MockBehavior.Strict);

    beforeEach(() => {
        markupMock.reset();

        markupMock.setup(factory => factory.bold(It.isAnyString())).returns(text => `b-${text}-b`);
        markupMock.setup(factory => factory.snippet(It.isAnyString())).returns(text => `s-${text}-s`);
        markupMock.setup(factory => factory.link(It.isAnyString(), It.isAnyString())).returns((href, text) => `l-${href}-${text}-l`);
        markupMock.setup(factory => factory.link(It.isAnyString())).returns(href => `l-${href}-l`);
    });

    it('build issue details', () => {
        const testSubject = new IssueDetailsBuilder(markupMock.object);

        const result = testSubject.build(null, environmentInfo, sampleIssueDetailsData);

        expect(result).toMatchSnapshot();
    });
});
