// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export interface DisplayableVisualizationTypeData {
    title: string;
    subtitle?: JSX.Element;

    // populated if-and-only-if visualization is for an ad-hoc tool
    adHoc: AdHocDisplayableVisualizationTypeData | null;
}

export interface AdHocDisplayableVisualizationTypeData {
    enableMessage: string;
    toggleLabel: string;
    linkToDetailsViewText: string;
}
