// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ReactFCWithDisplayName } from 'common/react/named-fc';
import { ResultsFilter } from 'common/types/results-filter';
import { TestingContentProps } from 'electron/platform/android/testing-content';
import { VisualHelperSection } from 'electron/types/visual-helper-section';
import { LeftNavItemKey } from './left-nav-item-key';

export type ContentPageInfo = {
    title: string;
    allowsExportReport: boolean;
    description?: JSX.Element;
    instancesSectionComponent?: ReactFCWithDisplayName<TestingContentProps>;
    resultsFilter: ResultsFilter;
    visualHelperSection: VisualHelperSection;
};

export type ContentPagesInfo = {
    [key in keyof LeftNavItemKey]: ContentPageInfo;
};
