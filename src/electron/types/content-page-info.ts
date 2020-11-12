// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CommonInstancesSectionProps } from 'common/components/cards/common-instances-section-props';
import { ReactFCWithDisplayName } from 'common/react/named-fc';
import { ResultsFilter } from 'common/types/results-filter';
import { LeftNavItemKey } from './left-nav-item-key';

export type ContentPageInfo = {
    title: string;
    allowsExportReport: boolean;
    description: JSX.Element;
    instancesSectionComponent: ReactFCWithDisplayName<CommonInstancesSectionProps>;
    resultsFilter: ResultsFilter;
};

export type ContentPagesInfo = {
    [key in keyof LeftNavItemKey]: ContentPageInfo;
};
