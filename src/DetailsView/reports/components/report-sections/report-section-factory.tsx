// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EnvironmentInfo } from '../../../../common/environment-info-provider';
import { GetGuidanceTagsFromGuidanceLinks } from '../../../../common/get-guidance-tags-from-guidance-links';
import { ReactSFCWithDisplayName } from '../../../../common/react/named-sfc';
import { ScanResults } from '../../../../scanner/iruleresults';

export type SectionProps = {
    pageTitle: string;
    pageUrl: string;
    description: string;
    scanDate: Date;
    environmentInfo: EnvironmentInfo;
    scanResult: ScanResults;
    toUtcString: (date: Date) => string;
    getCollapsibleScript: () => string;
    getGuidanceTagsFromGuidanceLinks: GetGuidanceTagsFromGuidanceLinks;
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
