// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CreateIssueDetailsTextData } from 'common/types/create-issue-details-text-data';
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { IMock, It, Mock, MockBehavior } from 'typemoq';
import { createIssueDetailsBuilder } from '../../../../../issue-filing/common/create-issue-details-builder';
import { MarkupFormatter } from '../../../../../issue-filing/common/markup/markup-formatter';

describe(createIssueDetailsBuilder, () => {
    const sampleIssueDetailsData: CreateIssueDetailsTextData = {
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
        relatedPaths: ['related-path-1', 'related-path-2'],
    };

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

    let markupMock: IMock<MarkupFormatter>;

    beforeEach(() => {
        markupMock = Mock.ofType<MarkupFormatter>(undefined, MockBehavior.Strict);

        markupMock
            .setup(factory => factory.snippet(It.isAnyString()))
            .returns(text => `s-${text}-s`);
        markupMock
            .setup(factory => factory.link(It.isAnyString(), It.isAnyString()))
            .returns((href, text) => `l-${href}-${text}-l`);
        markupMock.setup(factory => factory.link(It.isAnyString())).returns(href => `l-${href}-l`);
        markupMock
            .setup(factory => factory.sectionHeader(It.isAnyString()))
            .returns(header => `h-${header}-h`);
        markupMock
            .setup(factory => factory.howToFixSection(It.isAnyString()))
            .returns(text => `h-t--${text}--h-t`);
        markupMock
            .setup(factory => factory.relatedPaths(It.isAny()))
            .returns(paths => `rp-${paths.join('|')}-rp`);
        markupMock.setup(factory => factory.sectionHeaderSeparator()).returns(() => '--s-h-s--');
        markupMock.setup(factory => factory.footerSeparator()).returns(() => '--f-s--');
        markupMock.setup(factory => factory.sectionSeparator()).returns(() => '\n');
    });

    it.each(['pageUrl', null])('build issue details when targetApp.url is %s', targetAppUrl => {
        sampleIssueDetailsData.targetApp.url = targetAppUrl;
        const testSubject = createIssueDetailsBuilder(markupMock.object);

        const result = testSubject(toolData, sampleIssueDetailsData);

        expect(result).toMatchSnapshot();
    });

    it('builds issue details without snippet', () => {
        sampleIssueDetailsData.snippet = null;
        const testSubject = createIssueDetailsBuilder(markupMock.object);

        const result = testSubject(toolData, sampleIssueDetailsData);

        expect(result).toMatchSnapshot();
    });

    describe('relatedPaths section', () => {
        it('omits section if relatedPaths is not present in text data', () => {
            sampleIssueDetailsData.relatedPaths = null;
            const testSubject = createIssueDetailsBuilder(markupMock.object);

            const result = testSubject(toolData, sampleIssueDetailsData);

            expect(result).not.toContain('rp-'); // section marker for related paths
            expect(result).toMatchSnapshot();
        });

        it('omits section if length is constrained', () => {
            const testSubject = createIssueDetailsBuilder(markupMock.object);

            const result = testSubject(toolData, sampleIssueDetailsData, {
                isLengthConstrained: true,
            });

            expect(result).not.toContain('rp-'); // section marker for related paths
            expect(result).toMatchSnapshot();
        });
    });
});
