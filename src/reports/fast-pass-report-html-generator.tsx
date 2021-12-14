// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { noCardInteractionsSupported } from 'common/components/cards/card-interaction-support';
import { FixInstructionProcessor } from 'common/components/fix-instruction-processor';
import { NewTabLink } from 'common/components/new-tab-link';
import { NullComponent } from 'common/components/null-component';
import { RecommendColor } from 'common/components/recommend-color';
import { PropertyConfiguration } from 'common/configs/unified-result-property-configurations';
import { GetGuidanceTagsFromGuidanceLinks } from 'common/get-guidance-tags-from-guidance-links';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { TabStopRequirementState } from 'common/types/store-data/visualization-scan-result-data';
import { TabStopsFailedCounter } from 'DetailsView/tab-stops-failed-counter';
import * as React from 'react';
import {
    FastPassReport,
    FastPassReportDeps,
    FastPassReportProps,
} from 'reports/components/fast-pass-report';

import { ReportCollapsibleContainerControl } from './components/report-sections/report-collapsible-container';
import { ReactStaticRenderer } from './react-static-renderer';

export type FastPassReportModel = {
    description: string;
    scanMetadata: ScanMetadata;
    results: {
        automatedChecks: CardsViewModel;
        tabStops: TabStopRequirementState;
    };
};

export class FastPassReportHtmlGenerator {
    constructor(
        private readonly reactStaticRenderer: ReactStaticRenderer,
        private readonly getCollapsibleScript: () => string,
        private readonly utcDateConverter: (scanDate: Date) => string,
        private readonly getGuidanceTagsFromGuidanceLinks: GetGuidanceTagsFromGuidanceLinks,
        private readonly fixInstructionProcessor: FixInstructionProcessor,
        private readonly recommendColor: RecommendColor,
        private readonly getPropertyConfiguration: (id: string) => Readonly<PropertyConfiguration>,
        private readonly tabStopsFailedCounter: TabStopsFailedCounter,
    ) {}

    public generateHtml(model: FastPassReportModel): string {
        const { description, scanMetadata, results } = model;

        const props: FastPassReportProps = {
            description,
            deps: {
                fixInstructionProcessor: this.fixInstructionProcessor,
                recommendColor: this.recommendColor,
                collapsibleControl: ReportCollapsibleContainerControl,
                getGuidanceTagsFromGuidanceLinks: this.getGuidanceTagsFromGuidanceLinks,
                getPropertyConfigById: this.getPropertyConfiguration,
                cardInteractionSupport: noCardInteractionsSupported,
                cardsVisualizationModifierButtons: NullComponent,
                LinkComponent: NewTabLink,
                tabStopsFailedCounter: this.tabStopsFailedCounter,
            } as FastPassReportDeps,
            toUtcString: this.utcDateConverter,
            getCollapsibleScript: this.getCollapsibleScript,
            getGuidanceTagsFromGuidanceLinks: this.getGuidanceTagsFromGuidanceLinks,
            fixInstructionProcessor: this.fixInstructionProcessor,
            recommendColor: this.recommendColor,
            scanMetadata,
            results,
        };

        const reportElement: JSX.Element = <FastPassReport {...props} />;
        const reportMarkup: string = this.reactStaticRenderer.renderToStaticMarkup(reportElement);

        return '<!DOCTYPE html><html lang="en">' + reportMarkup + '</html>';
    }
}
