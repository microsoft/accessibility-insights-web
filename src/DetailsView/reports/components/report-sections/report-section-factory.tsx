// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EnvironmentInfo } from '../../../../common/environment-info-provider';
import { ReactSFCWithDisplayName } from '../../../../common/react/named-sfc';
import { ScanResults } from '../../../../scanner/iruleresults';

export type SectionProps = {
    pageTitle: string;
    pageUrl: string;
    description: string;
    scanDate: Date;
    environmentInfo: EnvironmentInfo;
    scanResult: ScanResults;
};

export type ReportSectionFactory = {
    BodySection: ReactSFCWithDisplayName;
    Header: ReactSFCWithDisplayName;
    Title: ReactSFCWithDisplayName;
    Summary: ReactSFCWithDisplayName<SectionProps>;
    Details: ReactSFCWithDisplayName<SectionProps>;
    ResultSection: ReactSFCWithDisplayName;
    FailedInstances: ReactSFCWithDisplayName<SectionProps>;
    PassedChecks: ReactSFCWithDisplayName<SectionProps>;
    NotApplicableChecks: ReactSFCWithDisplayName<SectionProps>;
    Footer: ReactSFCWithDisplayName;
};
