// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { noCardInteractionsSupported } from 'common/components/cards/card-interaction-support';
import { FixInstructionProcessor } from 'common/components/fix-instruction-processor';
import { NewTabLink } from 'common/components/new-tab-link';
import { NullComponent } from 'common/components/null-component';
import { PropertyConfiguration } from 'common/configs/unified-result-property-configurations';
import { GetGuidanceTagsFromGuidanceLinks } from 'common/get-guidance-tags-from-guidance-links';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import * as React from 'react';

import { ReportBody, ReportBodyProps } from './components/report-sections/report-body';
import { ReportCollapsibleContainerControl } from './components/report-sections/report-collapsible-container';
import {
    ReportSectionFactory,
    SectionDeps,
    SectionProps,
} from './components/report-sections/report-section-factory';
import { ReactStaticRenderer } from './react-static-renderer';
import { SummaryReportSectionProps } from 'reports/components/report-sections/summary-report-section-factory';
import {
    CrawlSummaryDetails,
    SummaryScanResults,
} from 'reports/package/accessibilityInsightsReport';

export class SummaryReportHtmlGenerator {
    constructor(
        private readonly sectionFactory: ReportSectionFactory<SummaryReportSectionProps>,
        private readonly reactStaticRenderer: ReactStaticRenderer,
        private readonly getCollapsibleScript: () => string,
        private readonly utcDateConverter: (scanDate: Date) => string,
    ) {}

    public generateHtml(
        scanDetails: CrawlSummaryDetails,
        scanMetadata: ScanMetadata,
        results: SummaryScanResults,
    ): string {
        const HeadSection = this.sectionFactory.HeadSection;
        const headMarkup: string = this.reactStaticRenderer.renderToStaticMarkup(<HeadSection />);

        const detailsProps: SummaryReportSectionProps = {
            scanDetails,
            scanMetadata,
            results,
            toUtcString: this.utcDateConverter,
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
