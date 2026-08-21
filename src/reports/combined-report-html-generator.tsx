// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { limitedCardInteractionsSupported } from 'common/components/cards/card-interaction-support';
import { FixInstructionProcessor } from 'common/components/fix-instruction-processor';
import { NullComponent } from 'common/components/null-component';
import { RecommendColor } from 'common/components/recommend-color';
import { PropertyConfiguration } from 'common/configs/unified-result-property-configurations';
import { GetGuidanceTagsFromGuidanceLinks } from 'common/get-guidance-tags-from-guidance-links';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import * as React from 'react';
import { NewTabLinkWithConfirmationDialog } from 'reports/components/new-tab-link-confirmation-dialog';
import { ReportBody, ReportBodyProps } from 'reports/components/report-sections/report-body';
import { ReportCollapsibleContainerControl } from 'reports/components/report-sections/report-collapsible-container';
import { UrlResultCounts } from 'reports/package/accessibilityInsightsReport';
import { CombinedReportSectionProps } from './components/report-sections/combined-report-section-factory';
import {
    ReportSectionFactory,
    SectionDeps,
} from './components/report-sections/report-section-factory';
import { ReactStaticRenderer } from './react-static-renderer';

export class CombinedReportHtmlGenerator {
    constructor(
        private readonly sectionFactory: ReportSectionFactory<CombinedReportSectionProps>,
        private readonly reactStaticRenderer: ReactStaticRenderer,
        private readonly getCollapsibleScript: () => string,
        private readonly utcDateConverter: (scanDate: Date) => string,
        private readonly secondsToTimeStringConverter: (seconds: number) => string,
        private readonly getGuidanceTagsFromGuidanceLinks: GetGuidanceTagsFromGuidanceLinks,
        private readonly fixInstructionProcessor: FixInstructionProcessor,
        private readonly recommendColor: RecommendColor,
        private readonly getPropertyConfiguration: (id: string) => Readonly<PropertyConfiguration>,
        private readonly getCopyToClipboardScript: () => string,
    ) {}

    public generateHtml(
        scanMetadata: ScanMetadata,
        cardsByRule: CardsViewModel,
        urlResultCounts: UrlResultCounts,
        feedbackURL?: string,
    ): string {
        const HeadSection = this.sectionFactory.HeadSection;
        const headMarkup: string = this.reactStaticRenderer.renderToStaticMarkup(<HeadSection />);

        const detailsProps: CombinedReportSectionProps = {
            scanMetadata,
            deps: {
                fixInstructionProcessor: this.fixInstructionProcessor,
                recommendColor: this.recommendColor,
                collapsibleControl: ReportCollapsibleContainerControl,
                getGuidanceTagsFromGuidanceLinks: this.getGuidanceTagsFromGuidanceLinks,
                getPropertyConfigById: this.getPropertyConfiguration,
                cardInteractionSupport: limitedCardInteractionsSupported,
                cardsVisualizationModifierButtons: NullComponent,
                LinkComponent: NewTabLinkWithConfirmationDialog,
                feedbackURL: feedbackURL || undefined,
            } as SectionDeps,
            cardsViewData: cardsByRule,
            urlResultCounts,
            toUtcString: this.utcDateConverter,
            secondsToTimeString: this.secondsToTimeStringConverter,
            getCollapsibleScript: this.getCollapsibleScript,
            sectionHeadingLevel: 2,
            getCopyToClipboardScript: this.getCopyToClipboardScript,
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
