// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import * as React from 'react';

import { SummaryReportSectionProps } from 'reports/components/report-sections/summary-report-section-factory';
import { SummaryScanResults } from 'reports/package/accessibilityInsightsReport';
import { ReportBody, ReportBodyProps } from './components/report-sections/report-body';
import { ReportCollapsibleContainerControl } from './components/report-sections/report-collapsible-container';
import { ReportSectionFactory } from './components/report-sections/report-section-factory';
import { ReactStaticRenderer } from './react-static-renderer';

export class SummaryReportHtmlGenerator {
    constructor(
        private readonly sectionFactory: ReportSectionFactory<SummaryReportSectionProps>,
        private readonly reactStaticRenderer: ReactStaticRenderer,
        private readonly getCollapsibleScript: () => string,
        private readonly utcDateConverter: (scanDate: Date) => string,
        private readonly secondsToTimeStringConverter: (seconds: number) => string,
    ) {}

    public generateHtml(scanMetadata: ScanMetadata, results: SummaryScanResults): string {
        const HeadSection = this.sectionFactory.HeadSection;
        const headMarkup: string = this.reactStaticRenderer.renderToStaticMarkup(<HeadSection />);

        const detailsProps: SummaryReportSectionProps = {
            deps: {
                collapsibleControl: ReportCollapsibleContainerControl,
            },
            scanMetadata,
            results,
            toUtcString: this.utcDateConverter,
            secondsToTimeString: this.secondsToTimeStringConverter,
            getCollapsibleScript: this.getCollapsibleScript,
        };

        const props: ReportBodyProps<SummaryReportSectionProps> = {
            sectionFactory: this.sectionFactory,
            ...detailsProps,
        };

        const bodyElement: JSX.Element = <ReportBody<SummaryReportSectionProps> {...props} />;
        const bodyMarkup: string = this.reactStaticRenderer.renderToStaticMarkup(bodyElement);

        return '<!DOCTYPE html><html lang="en">' + headMarkup + bodyMarkup + '</html>';
    }
}
