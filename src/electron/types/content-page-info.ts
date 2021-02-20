// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ReactFCWithDisplayName } from 'common/react/named-fc';
import { ResultsFilter } from 'common/types/results-filter';
import { TestingContentProps } from 'electron/platform/android/testing-content';
import { VisualHelperSection } from 'electron/types/visual-helper-section';
import { ReflowCommandBarProps } from 'electron/views/results/components/reflow-command-bar';
import { LeftNavItemKey } from './left-nav-item-key';

export type StartOverButtonTabSettings = {
    onClick: () => void;
    disabled: boolean;
};

export type ContentPageInfo = {
    title: string;
    allowsExportReport: boolean;
    description?: JSX.Element;
    instancesSectionComponent?: ReactFCWithDisplayName<TestingContentProps>;
    resultsFilter: ResultsFilter;
    visualHelperSection: VisualHelperSection;
    startOverButtonTabSettings: (props: ReflowCommandBarProps) => StartOverButtonTabSettings;
};

export type ContentPagesInfo = {
    [key in keyof LeftNavItemKey]: ContentPageInfo;
};
