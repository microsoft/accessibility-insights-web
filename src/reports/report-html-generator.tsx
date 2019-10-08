// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { noCardInteractionsSupported } from 'common/components/cards/card-interaction-support';
import { UnifiedStatusResults } from 'common/components/cards/failed-instances-section';
import { PropertyConfiguration } from 'common/configs/unified-result-property-configurations';
import { EnvironmentInfo } from 'common/environment-info-provider';
import { GetGuidanceTagsFromGuidanceLinks } from 'common/get-guidance-tags-from-guidance-links';
import { FixInstructionProcessor } from 'injected/fix-instruction-processor';
import * as React from 'react';
import { ScanResults } from 'scanner/iruleresults';
import { ReportHead } from './components/report-head';
import { ReportBody, ReportBodyProps } from './components/report-sections/report-body';
import { ReportCollapsibleContainerControl } from './components/report-sections/report-collapsible-container';
import { ReportSectionFactory, SectionDeps, SectionProps } from './components/report-sections/report-section-factory';
import { ReactStaticRenderer } from './react-static-renderer';

export class ReportHtmlGenerator {
    constructor(
        private readonly sectionFactory: ReportSectionFactory,
        private readonly reactStaticRenderer: ReactStaticRenderer,
        private readonly environmentInfo: EnvironmentInfo,
        private readonly getCollpasibleScript: () => string,
        private readonly utcDateConverter: (scanDate: Date) => string,
        private readonly getGuidanceTagsFromGuidanceLinks: GetGuidanceTagsFromGuidanceLinks,
        private readonly fixInstructionProcessor: FixInstructionProcessor,
        private readonly getPropertyConfiguration: (id: string) => Readonly<PropertyConfiguration>,
    ) {}

    public generateHtml(
        scanResult: ScanResults,
        scanDate: Date,
        pageTitle: string,
        pageUrl: string,
        description: string,
        ruleResultsByStatus: UnifiedStatusResults,
    ): string {
        const headElement: JSX.Element = <ReportHead />;
        const headMarkup: string = this.reactStaticRenderer.renderToStaticMarkup(headElement);

        const detailsProps: SectionProps = {
            pageTitle,
            pageUrl,
            description,
            scanDate,
            scanResult,
            deps: {
                fixInstructionProcessor: this.fixInstructionProcessor,
                collapsibleControl: ReportCollapsibleContainerControl,
                getGuidanceTagsFromGuidanceLinks: this.getGuidanceTagsFromGuidanceLinks,
                getPropertyConfigById: this.getPropertyConfiguration,
                cardInteractionSupport: noCardInteractionsSupported,
            } as SectionDeps,
            ruleResultsByStatus: ruleResultsByStatus,
            environmentInfo: this.environmentInfo,
            toUtcString: this.utcDateConverter,
            getCollapsibleScript: this.getCollpasibleScript,
            getGuidanceTagsFromGuidanceLinks: this.getGuidanceTagsFromGuidanceLinks,
            fixInstructionProcessor: this.fixInstructionProcessor,
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
