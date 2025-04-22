// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { limitedCardInteractionsSupported } from 'common/components/cards/card-interaction-support';
import { FixInstructionProcessor } from 'common/components/fix-instruction-processor';
import { HeadingLevel } from 'common/components/heading-element-for-level';
import { NewTabLink } from 'common/components/new-tab-link';
import { NullComponent } from 'common/components/null-component';
import { RecommendColor } from 'common/components/recommend-color';
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

export class ReportHtmlGenerator {
    constructor(
        private readonly sectionFactory: ReportSectionFactory,
        private readonly reactStaticRenderer: ReactStaticRenderer,
        private readonly getCollapsibleScript: () => string,
        private readonly utcDateConverter: (scanDate: Date) => string,
        private readonly getGuidanceTagsFromGuidanceLinks: GetGuidanceTagsFromGuidanceLinks,
        private readonly fixInstructionProcessor: FixInstructionProcessor,
        private readonly recommendColor: RecommendColor,
        private readonly getPropertyConfiguration: (id: string) => Readonly<PropertyConfiguration>,
        private readonly getNextHeadingLevel: (headingLevel: HeadingLevel) => HeadingLevel,
        private readonly getCopyToClipboardScript: () => string,
    ) {}

    public generateHtml(
        description: string,
        cardsViewData: CardsViewModel,
        scanMetadata: ScanMetadata,
        feedbackURL?: string,
    ): string {
        const HeadSection = this.sectionFactory.HeadSection;
        const headMarkup: string = this.reactStaticRenderer.renderToStaticMarkup(<HeadSection />);

        const detailsProps: SectionProps = {
            description,
            deps: {
                fixInstructionProcessor: this.fixInstructionProcessor,
                recommendColor: this.recommendColor,
                collapsibleControl: ReportCollapsibleContainerControl,
                getGuidanceTagsFromGuidanceLinks: this.getGuidanceTagsFromGuidanceLinks,
                getPropertyConfigById: this.getPropertyConfiguration,
                cardInteractionSupport: limitedCardInteractionsSupported,
                cardsVisualizationModifierButtons: NullComponent,
                LinkComponent: NewTabLink,
                getNextHeadingLevel: this.getNextHeadingLevel,
                feedbackURL: feedbackURL || undefined,
            } as SectionDeps,
            cardsViewData: cardsViewData,
            toUtcString: this.utcDateConverter,
            getCollapsibleScript: this.getCollapsibleScript,
            getGuidanceTagsFromGuidanceLinks: this.getGuidanceTagsFromGuidanceLinks,
            fixInstructionProcessor: this.fixInstructionProcessor,
            recommendColor: this.recommendColor,
            scanMetadata,
            sectionHeadingLevel: 2,
            getCopyToClipboardScript: this.getCopyToClipboardScript,
        } as SectionProps;

        const props: ReportBodyProps = {
            sectionFactory: this.sectionFactory,
            ...detailsProps,
        };

        const bodyElement: JSX.Element = <ReportBody {...props} />;
        const bodyMarkup: string = this.reactStaticRenderer.renderToStaticMarkup(bodyElement);

        return '<!DOCTYPE html><html lang="en">' + headMarkup + bodyMarkup + '</html>';
    }
}
