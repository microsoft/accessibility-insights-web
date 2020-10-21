// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import * as React from 'react';
import { ScanTimespan } from 'reports/components/report-sections/base-summary-report-section-props';
import { ReportBody, ReportBodyProps } from 'reports/components/report-sections/report-body';
import { CombinedReportSectionProps } from './components/report-sections/combined-report-section-factory';
import { ReportSectionFactory } from './components/report-sections/report-section-factory';
import { ReactStaticRenderer } from './react-static-renderer';

export class CombinedReportHtmlGenerator {
    constructor(
        private readonly sectionFactory: ReportSectionFactory<CombinedReportSectionProps>,
        private readonly reactStaticRenderer: ReactStaticRenderer,
        private readonly getCollapsibleScript: () => string,
        private readonly utcDateConverter: (scanDate: Date) => string,
        private readonly secondsToTimeStringConverter: (seconds: number) => string,
    ) {}

    public generateHtml(scanTimespan: ScanTimespan, scanMetadata: ScanMetadata): string {
        const HeadSection = this.sectionFactory.HeadSection;
        const headMarkup: string = this.reactStaticRenderer.renderToStaticMarkup(<HeadSection />);

        const detailsProps: CombinedReportSectionProps = {
            scanTimespan,
            scanMetadata,
            toUtcString: this.utcDateConverter,
            secondsToTimeString: this.secondsToTimeStringConverter,
            getCollapsibleScript: this.getCollapsibleScript,
        };

        const props: ReportBodyProps<CombinedReportSectionProps> = {
            sectionFactory: this.sectionFactory,
            ...detailsProps,
        };

        const bodyElement: JSX.Element = <ReportBody<CombinedReportSectionProps> {...props} />;
        const bodyMarkup: string = this.reactStaticRenderer.renderToStaticMarkup(bodyElement);

        return '<!DOCTYPE html><html lang="en">' + headMarkup + bodyMarkup + '</html>';
    }
}
