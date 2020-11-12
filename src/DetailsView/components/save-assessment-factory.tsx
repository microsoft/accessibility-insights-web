// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { CommandBarProps } from 'DetailsView/components/details-view-command-bar';
import { SaveAssessmentButton } from 'DetailsView/components/save-assessment-button';

export type SaveAssessmentFactoryDeps = {};

export type SaveAssessmentFactoryProps = CommandBarProps & {
    deps: SaveAssessmentFactoryDeps;
};

export function getSaveButtonForAssessment(props: SaveAssessmentFactoryProps): JSX.Element {
    return <SaveAssessmentButton />;
}

export function getSaveButtonForFastPass(props: SaveAssessmentFactoryProps): JSX.Element | null {
    return null;
}
