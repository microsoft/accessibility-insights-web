// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EnvironmentInfo } from 'common/environment-info-provider';
import { GetGuidanceTagsFromGuidanceLinks } from 'common/get-guidance-tags-from-guidance-links';
import { ReactSFCWithDisplayName } from 'common/react/named-sfc';
import { FixInstructionProcessor } from 'injected/fix-instruction-processor';
import { ScanResults } from 'scanner/iruleresults';

import { CollapsibleComponentCardsProps } from '../../../DetailsView/components/cards/collapsible-component-cards';
import { FailedInstancesSectionV2Deps, UnifiedStatusResults } from '../../../DetailsView/components/cards/failed-instances-section-v2';

export type SectionProps = {
    deps: FailedInstancesSectionV2Deps;
    fixInstructionProcessor: FixInstructionProcessor;
    pageTitle: string;
    pageUrl: string;
    description: string;
    scanDate: Date;
    environmentInfo: EnvironmentInfo;
    scanResult: ScanResults;
    toUtcString: (date: Date) => string;
    getCollapsibleScript: () => string;
    getGuidanceTagsFromGuidanceLinks: GetGuidanceTagsFromGuidanceLinks;
    ruleResultsByStatus: UnifiedStatusResults;
};

export type ReportSectionFactory = {
    BodySection: ReactSFCWithDisplayName;
    ContentContainer: ReactSFCWithDisplayName;
    HeaderSection: ReactSFCWithDisplayName<SectionProps>;
    TitleSection: ReactSFCWithDisplayName;
    SummarySection: ReactSFCWithDisplayName<SectionProps>;
    DetailsSection: ReactSFCWithDisplayName<SectionProps>;
    ResultsContainer: ReactSFCWithDisplayName<SectionProps>;
    FailedInstancesSection: ReactSFCWithDisplayName<SectionProps>;
    PassedChecksSection: ReactSFCWithDisplayName<SectionProps>;
    NotApplicableChecksSection: ReactSFCWithDisplayName<SectionProps>;
    FooterSection: ReactSFCWithDisplayName<SectionProps>;
};
