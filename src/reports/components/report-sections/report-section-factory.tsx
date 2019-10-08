// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FailedInstancesSectionDeps, UnifiedStatusResults } from 'common/components/cards/failed-instances-section';
import { EnvironmentInfo } from 'common/environment-info-provider';
import { GetGuidanceTagsFromGuidanceLinks } from 'common/get-guidance-tags-from-guidance-links';
import { ReactFCWithDisplayName } from 'common/react/named-fc';
import { FixInstructionProcessor } from 'injected/fix-instruction-processor';
import { ScanResults } from 'scanner/iruleresults';

import { UserConfigurationStoreData } from '../../../common/types/store-data/user-configuration-store';
import { NotApplicableChecksSectionDeps } from './not-applicable-checks-section';
import { PassedChecksSectionDeps } from './passed-checks-section';

export type SectionDeps = NotApplicableChecksSectionDeps & FailedInstancesSectionDeps & PassedChecksSectionDeps;

export type SectionProps = {
    deps: SectionDeps;
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
    userConfigurationStoreData: UserConfigurationStoreData;
};

export type ReportSectionFactory = {
    BodySection: ReactFCWithDisplayName;
    ContentContainer: ReactFCWithDisplayName;
    HeaderSection: ReactFCWithDisplayName<SectionProps>;
    TitleSection: ReactFCWithDisplayName;
    SummarySection: ReactFCWithDisplayName<SectionProps>;
    DetailsSection: ReactFCWithDisplayName<SectionProps>;
    ResultsContainer: ReactFCWithDisplayName<SectionProps>;
    FailedInstancesSection: ReactFCWithDisplayName<SectionProps>;
    PassedChecksSection: ReactFCWithDisplayName<SectionProps>;
    NotApplicableChecksSection: ReactFCWithDisplayName<SectionProps>;
    FooterSection: ReactFCWithDisplayName<SectionProps>;
};
