// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { noCardInteractionsSupported } from 'common/components/cards/card-interaction-support';
import { FixInstructionProcessor } from 'common/components/fix-instruction-processor';
import { NullComponent } from 'common/components/null-component';
import { RecommendColor } from 'common/components/recommend-color';
import { DateProvider } from 'common/date-provider';
import { GetGuidanceTagsFromGuidanceLinks } from 'common/get-guidance-tags-from-guidance-links';
import {
    ScanMetadata,
    ScanTimespan,
    ToolData,
} from 'common/types/store-data/unified-data-interface';
import * as React from 'react';
import { CombinedReportHtmlGenerator } from 'reports/combined-report-html-generator';
import { NewTabLinkWithConfirmationDialog } from 'reports/components/new-tab-link-confirmation-dialog';
import { CombinedReportSectionProps } from 'reports/components/report-sections/combined-report-section-factory';
import { ReportBody, ReportBodyProps } from 'reports/components/report-sections/report-body';
import { ReportCollapsibleContainerControl } from 'reports/components/report-sections/report-collapsible-container';
import {
    ReportSectionFactory,
    SectionDeps,
} from 'reports/components/report-sections/report-section-factory';
import { ReactStaticRenderer } from 'reports/react-static-renderer';
import { exampleUnifiedStatusResults } from 'tests/unit/tests/common/components/cards/sample-view-model-data';
import { IMock, It, Mock, Times } from 'typemoq';

describe('CombinedReportHtmlGenerator', () => {
    let testSubject: CombinedReportHtmlGenerator;

    const pageTitle: string = 'page-title';
    const baseUrl: string = 'https://page-url/';

    const getUTCStringFromDateStub: typeof DateProvider.getUTCStringFromDate = () => '';
    const getTimeStringFromSecondsStub: typeof DateProvider.getTimeStringFromSeconds = () => '';

    const fixInstructionProcessorMock = Mock.ofType(FixInstructionProcessor);
    const recommendColorStub = {} as RecommendColor;
    const getPropertyConfigurationStub = (id: string) => null;
    const getGuidanceTagsStub: GetGuidanceTagsFromGuidanceLinks = () => [];

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

    const targetAppInfo = {
        name: pageTitle,
        url: baseUrl,
    };

    const scanTimespan: ScanTimespan = {
        scanStart: new Date(2020, 1, 2, 3),
        scanComplete: new Date(2020, 4, 5, 6),
        durationSeconds: 42,
    };

    const scanMetadata = {
        toolData: toolData,
        targetAppInfo: targetAppInfo,
        timespan: scanTimespan,
    } as ScanMetadata;

    const urlResultCounts = {
        passedUrls: 1,
        failedUrls: 2,
        unscannableUrls: 3,
    };

    const cardsViewData = {
        cards: exampleUnifiedStatusResults,
        visualHelperEnabled: true,
        allCardsCollapsed: true,
    };

    let getScriptMock: IMock<() => string>;
    let sectionFactoryMock: IMock<ReportSectionFactory<CombinedReportSectionProps>>;
    let rendererMock: IMock<ReactStaticRenderer>;

    beforeEach(() => {
        getScriptMock = Mock.ofInstance(() => '');
        sectionFactoryMock = Mock.ofType<ReportSectionFactory<CombinedReportSectionProps>>();
        rendererMock = Mock.ofType<ReactStaticRenderer>();

        testSubject = new CombinedReportHtmlGenerator(
            sectionFactoryMock.object,
            rendererMock.object,
            getScriptMock.object,
            getUTCStringFromDateStub,
            getTimeStringFromSecondsStub,
            getGuidanceTagsStub,
            fixInstructionProcessorMock.object,
            recommendColorStub,
            getPropertyConfigurationStub,
            getScriptMock.object,
        );
    });

    it('generateHtml', () => {
        const sectionProps: ReportBodyProps<CombinedReportSectionProps> = {
            deps: {
                fixInstructionProcessor: fixInstructionProcessorMock.object,
                recommendColor: recommendColorStub,
                getGuidanceTagsFromGuidanceLinks: getGuidanceTagsStub,
                getPropertyConfigById: getPropertyConfigurationStub,
                collapsibleControl: ReportCollapsibleContainerControl,
                cardInteractionSupport: noCardInteractionsSupported,
                cardsVisualizationModifierButtons: NullComponent,
                LinkComponent: NewTabLinkWithConfirmationDialog,
            } as SectionDeps,
            sectionFactory: sectionFactoryMock.object,
            toUtcString: getUTCStringFromDateStub,
            secondsToTimeString: getTimeStringFromSecondsStub,
            getCollapsibleScript: getScriptMock.object,
            scanMetadata,
            cardsViewData,
            urlResultCounts,
            sectionHeadingLevel: 2,
            getCopyToClipboardScript: getScriptMock.object,
        };

        const headElement: JSX.Element = <NullComponent />;
        const bodyElement: JSX.Element = (
            <ReportBody<CombinedReportSectionProps> {...sectionProps} />
        );

        sectionFactoryMock.setup(mock => mock.HeadSection).returns(() => NullComponent);
        rendererMock
            .setup(r => r.renderToStaticMarkup(It.isObjectWith(headElement)))
            .returns(() => '<head-markup />')
            .verifiable(Times.once());
        rendererMock
            .setup(r => r.renderToStaticMarkup(It.isObjectWith(bodyElement)))
            .returns(() => '<body-markup />')
            .verifiable(Times.once());

        const html = testSubject.generateHtml(scanMetadata, cardsViewData, urlResultCounts);

        expect(html).toMatchSnapshot();
    });
});
