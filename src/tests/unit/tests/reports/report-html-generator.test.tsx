// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { noCardInteractionsSupported } from 'common/components/cards/card-interaction-support';
import { FixInstructionProcessor } from 'common/components/fix-instruction-processor';
import { HeadingLevel } from 'common/components/heading-element-for-level';
import { NewTabLink } from 'common/components/new-tab-link';
import { NullComponent } from 'common/components/null-component';
import { RecommendColor } from 'common/components/recommend-color';
import { DateProvider } from 'common/date-provider';
import { GetGuidanceTagsFromGuidanceLinks } from 'common/get-guidance-tags-from-guidance-links';
import { ScanMetadata, ToolData } from 'common/types/store-data/unified-data-interface';
import * as React from 'react';
import {
    ReportBody,
    ReportBodyProps,
    ReportBodySectionFactory,
} from 'reports/components/report-sections/report-body';
import { ReportCollapsibleContainerControl } from 'reports/components/report-sections/report-collapsible-container';
import {
    ReportSectionFactory,
    SectionDeps,
} from 'reports/components/report-sections/report-section-factory';
import { ReactStaticRenderer } from 'reports/react-static-renderer';
import { ReportHtmlGenerator } from 'reports/report-html-generator';
import { It, Mock, MockBehavior, Times } from 'typemoq';

import { exampleUnifiedStatusResults } from '../common/components/cards/sample-view-model-data';

describe('ReportHtmlGenerator', () => {
    test('generateHtml', () => {
        const scanDate: Date = new Date(2018, 2, 12, 16, 24);
        const pageTitle: string = 'page-title';
        const pageUrl: string = 'https://page-url/';
        const description: string = 'description';
        const fixInstructionProcessorMock = Mock.ofType(FixInstructionProcessor);
        const recommendColorMock = Mock.ofType(RecommendColor);
        const getPropertyConfigurationStub = (id: string) => null;
        const getNextHeadingLevelStub = (headingLevel: HeadingLevel) => null;
        const cardInteractionSupport = noCardInteractionsSupported;

        const getUTCStringFromDateStub: typeof DateProvider.getUTCStringFromDate = () => '';
        const getGuidanceTagsStub: GetGuidanceTagsFromGuidanceLinks = () => [];

        const sectionFactoryMock = Mock.ofType<ReportSectionFactory>();

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

        const getScriptMock = Mock.ofInstance(() => '');

        const targetAppInfo = {
            name: pageTitle,
            url: pageUrl,
        };

        const scanMetadata = {
            toolData: toolData,
            targetAppInfo: targetAppInfo,
            timespan: {
                scanComplete: scanDate,
            },
        } as ScanMetadata;

        const sectionProps: ReportBodyProps = {
            deps: {
                fixInstructionProcessor: fixInstructionProcessorMock.object,
                recommendColor: recommendColorMock.object,
                getGuidanceTagsFromGuidanceLinks: getGuidanceTagsStub,
                getPropertyConfigById: getPropertyConfigurationStub,
                collapsibleControl: ReportCollapsibleContainerControl,
                cardInteractionSupport: cardInteractionSupport,
                cardsVisualizationModifierButtons: NullComponent,
                LinkComponent: NewTabLink,
                getNextHeadingLevel: getNextHeadingLevelStub,
            } as SectionDeps,
            fixInstructionProcessor: fixInstructionProcessorMock.object,
            recommendColor: recommendColorMock.object,
            sectionFactory: sectionFactoryMock.object as ReportBodySectionFactory,
            description,
            toUtcString: getUTCStringFromDateStub,
            getCollapsibleScript: getScriptMock.object,
            getGuidanceTagsFromGuidanceLinks: getGuidanceTagsStub,
            cardsViewData: {
                cards: exampleUnifiedStatusResults,
                visualHelperEnabled: true,
                allCardsCollapsed: true,
            },
            scanMetadata,
            sectionHeadingLevel: 2,
        } as ReportBodyProps;

        const headElement: JSX.Element = <NullComponent />;
        const bodyElement: JSX.Element = <ReportBody {...sectionProps} />;

        const rendererMock = Mock.ofType(ReactStaticRenderer, MockBehavior.Strict);
        sectionFactoryMock.setup(mock => mock.HeadSection).returns(() => NullComponent);
        rendererMock
            .setup(r => r.renderToStaticMarkup(It.isObjectWith(headElement)))
            .returns(() => '<head-markup />')
            .verifiable(Times.once());
        rendererMock
            .setup(r => r.renderToStaticMarkup(It.isObjectWith(bodyElement)))
            .returns(() => '<body-markup />')
            .verifiable(Times.once());

        const testObject = new ReportHtmlGenerator(
            sectionFactoryMock.object,
            rendererMock.object,
            getScriptMock.object,
            getUTCStringFromDateStub,
            getGuidanceTagsStub,
            fixInstructionProcessorMock.object,
            recommendColorMock.object,
            getPropertyConfigurationStub,
            getNextHeadingLevelStub,
            getScriptMock.object,
        );

        const actual = testObject.generateHtml(
            description,
            {
                cards: exampleUnifiedStatusResults,
                visualHelperEnabled: true,
                allCardsCollapsed: true,
            },
            scanMetadata,
        );

        expect(actual).toMatchSnapshot();
    });
});
