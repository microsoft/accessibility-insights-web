// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EnvironmentInfo } from '../../../../common/environment-info-provider';
import { ReactSFCWithDisplayName } from '../../../../common/react/named-sfc';
import { RuleResult, ScanResults } from '../../../../scanner/iruleresults';

export type SummaryProps = {
    scanResult: ScanResults;
};

export type DetailsProps = {
    pageTitle: string;
    pageUrl: string;
    description: string;
    scanDate: Date;
    environmentInfo: EnvironmentInfo;
};

export type CheckListProps = {
    results: RuleResult[];
    idPrefix: string;
    showInstanceCount: boolean;
    showInstances: boolean;
    congratulateIfEmpty: boolean;
};

export type ReportSectionFactory = {
    BodySection: ReactSFCWithDisplayName;
    Header: ReactSFCWithDisplayName;
    Title: ReactSFCWithDisplayName;
    Summary: ReactSFCWithDisplayName<SummaryProps>;
    Details: ReactSFCWithDisplayName<DetailsProps>;
    ResultSection: ReactSFCWithDisplayName;
    FailedInstances: ReactSFCWithDisplayName<CheckListProps>;
    PassedChecks: ReactSFCWithDisplayName<CheckListProps>;
    NotApplicableChecks: ReactSFCWithDisplayName<CheckListProps>;
    Footer: ReactSFCWithDisplayName;
};
