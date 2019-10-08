// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DateProvider } from 'common/date-provider';
import { EnvironmentInfo } from 'common/environment-info-provider';
import { GetGuidanceTagsFromGuidanceLinks } from 'common/get-guidance-tags-from-guidance-links';
import { FixInstructionProcessor } from 'injected/fix-instruction-processor';
import * as React from 'react';
import { ReportHead } from 'reports/components/report-head';
import { ReportBody, ReportBodyProps } from 'reports/components/report-sections/report-body';
import { ReportSectionFactory, SectionDeps } from 'reports/components/report-sections/report-section-factory';
import { ReactStaticRenderer } from 'reports/react-static-renderer';
import { ReportHtmlGenerator } from 'reports/report-html-generator';
import { ScanResults } from 'scanner/iruleresults';
import { It, Mock, MockBehavior, Times } from 'typemoq';
import { noCardInteractionsSupported } from '../../../../common/components/cards/card-interaction-support';
import { ReportCollapsibleContainerControl } from '../../../../reports/components/report-sections/report-collapsible-container';
import { exampleUnifiedStatusResults } from '../common/components/cards/sample-view-model-data';

describe('ReportHtmlGenerator', () => {
    test('generateHtml', () => {
        const browserSpec: string = 'browser-spect';
        const extensionVersion: string = 'extension-version';
        const axeCoreVersion: string = 'axe-version';
        const scanResult: ScanResults = {} as any;
        const scanDate: Date = new Date(2018, 2, 12, 16, 24);
        const pageTitle: string = 'page-title';
        const pageUrl: string = 'https://page-url/';
        const description: string = 'description';
        const fixInstructionProcessorMock = Mock.ofType(FixInstructionProcessor);
        const getPropertyConfigurationStub = (id: string) => null;
        const cardInteractionSupport = noCardInteractionsSupported;

        const getUTCStringFromDateStub: typeof DateProvider.getUTCStringFromDate = () => '';
        const getGuidanceTagsStub: GetGuidanceTagsFromGuidanceLinks = () => [];

        const sectionFactoryMock = Mock.ofType<ReportSectionFactory>();
        const environmentInfo: EnvironmentInfo = {
            axeCoreVersion,
            browserSpec,
            extensionVersion,
        };

        const getScriptMock = Mock.ofInstance(() => '');

        const sectionProps: ReportBodyProps = {
            deps: {
                fixInstructionProcessor: fixInstructionProcessorMock.object,
                getGuidanceTagsFromGuidanceLinks: getGuidanceTagsStub,
                getPropertyConfigById: getPropertyConfigurationStub,
                collapsibleControl: ReportCollapsibleContainerControl,
                cardInteractionSupport: cardInteractionSupport,
            } as SectionDeps,
            fixInstructionProcessor: fixInstructionProcessorMock.object,
            sectionFactory: sectionFactoryMock.object,
            pageTitle,
            pageUrl,
            description,
            scanDate,
            scanResult,
            environmentInfo,
            toUtcString: getUTCStringFromDateStub,
            getCollapsibleScript: getScriptMock.object,
            getGuidanceTagsFromGuidanceLinks: getGuidanceTagsStub,
            ruleResultsByStatus: exampleUnifiedStatusResults,
        } as ReportBodyProps;

        const headElement: JSX.Element = <ReportHead />;
        const bodyElement: JSX.Element = <ReportBody {...sectionProps} />;

        const rendererMock = Mock.ofType(ReactStaticRenderer, MockBehavior.Strict);
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
            environmentInfo,
            getScriptMock.object,
            getUTCStringFromDateStub,
            getGuidanceTagsStub,
            fixInstructionProcessorMock.object,
            getPropertyConfigurationStub,
        );

        const actual = testObject.generateHtml(scanResult, scanDate, pageTitle, pageUrl, description, exampleUnifiedStatusResults);

        expect(actual).toMatchSnapshot();
    });
});
