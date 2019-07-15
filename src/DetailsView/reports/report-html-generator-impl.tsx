// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { EnvironmentInfo } from '../../common/environment-info-provider';
import { GetGuidanceTagsFromGuidanceLinks } from '../../common/get-guidance-tags-from-guidance-links';
import { FixInstructionProcessor } from '../../injected/fix-instruction-processor';
import { ScanResults } from '../../scanner/iruleresults';
import { ReportHead } from './components/report-head';
import { ReportBody, ReportBodyProps } from './components/report-sections/report-body';
import { ReportSectionFactory, SectionProps } from './components/report-sections/report-section-factory';
import { ReactStaticRenderer } from './react-static-renderer';

export class ReportHtmlGeneratorImpl {
    constructor(
        private readonly sectionFactory: ReportSectionFactory,
        private readonly reactStaticRenderer: ReactStaticRenderer,
        private readonly environmentInfo: EnvironmentInfo,
        private readonly getCollpasibleScript: () => string,
        private readonly utcDateConverter: (scanDate: Date) => string,
        private readonly getGuidanceTagsFromGuidanceLinks: GetGuidanceTagsFromGuidanceLinks,
        private readonly fixInstructionProcessor: FixInstructionProcessor,
    ) {}

    public generateHtml(scanResult: ScanResults, scanDate: Date, pageTitle: string, pageUrl: string, description: string): string {
        const headElement: JSX.Element = <ReportHead />;
        const headMarkup: string = this.reactStaticRenderer.renderToStaticMarkup(headElement);

        const detailsProps: SectionProps = {
            pageTitle,
            pageUrl,
            description,
            scanDate,
            scanResult,
            environmentInfo: this.environmentInfo,
            toUtcString: this.utcDateConverter,
            getCollapsibleScript: this.getCollpasibleScript,
            getGuidanceTagsFromGuidanceLinks: this.getGuidanceTagsFromGuidanceLinks,
            fixInstructionProcessor: this.fixInstructionProcessor,
        };

        const props: ReportBodyProps = {
            sectionFactory: this.sectionFactory,
            ...detailsProps,
        };

        const bodyElement: JSX.Element = <ReportBody {...props} />;
        const bodyMarkup: string = this.reactStaticRenderer.renderToStaticMarkup(bodyElement);

        return '<!DOCTYPE html><html lang="en">' + headMarkup + bodyMarkup + '</html>';
    }
}
