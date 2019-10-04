// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior } from 'typemoq';
import { EnvironmentInfo } from '../../../../../common/environment-info-provider';
import { createIssueDetailsBuilder } from '../../../../../issue-filing/common/create-issue-details-builder';
import { MarkupFormatter } from '../../../../../issue-filing/common/markup/markup-formatter';

describe('Name of the group', () => {
    const sampleIssueDetailsData = {
        rule: {
            description: 'RR-help',
            id: 'RR-rule-id',
            url: 'RR-help-url',
            guidance: [{ text: 'WCAG-1.4.1' }, { text: 'wcag-2.8.2' }],
        } as any,
        targetApp: {
            name: 'pageTitle<x>',
            url: 'pageUrl',
        },
        element: {
            identifier: 'RR-selector<x>',
            conciseName: 'RR-selector<x>',
        },
        howToFixSummary: 'RR-failureSummary',
        snippet: 'RR-snippet   space',
    };
    const environmentInfo: EnvironmentInfo = {
        extensionVersion: '1.1.1',
        axeCoreVersion: '2.2.2',
        browserSpec: 'test spec',
    };

    let markupMock: IMock<MarkupFormatter>;

    beforeEach(() => {
        markupMock = Mock.ofType<MarkupFormatter>(undefined, MockBehavior.Strict);

        markupMock.setup(factory => factory.snippet(It.isAnyString())).returns(text => `s-${text}-s`);
        markupMock.setup(factory => factory.link(It.isAnyString(), It.isAnyString())).returns((href, text) => `l-${href}-${text}-l`);
        markupMock.setup(factory => factory.link(It.isAnyString())).returns(href => `l-${href}-l`);
        markupMock.setup(factory => factory.sectionHeader(It.isAnyString())).returns(header => `h-${header}-h`);
        markupMock.setup(factory => factory.howToFixSection(It.isAnyString())).returns(text => `h-t--${text}--h-t`);
        markupMock.setup(factory => factory.sectionHeaderSeparator()).returns(() => '--s-h-s--');
        markupMock.setup(factory => factory.footerSeparator()).returns(() => '--f-s--');
        markupMock.setup(factory => factory.sectionSeparator()).returns(() => '\n');
    });

    it('build issue details', () => {
        const testSubject = createIssueDetailsBuilder(markupMock.object);

        const result = testSubject(environmentInfo, sampleIssueDetailsData);

        expect(result).toMatchSnapshot();
    });
});
