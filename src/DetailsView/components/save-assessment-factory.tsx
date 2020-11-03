// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { CommandBarProps } from 'DetailsView/components/details-view-command-bar';
import { FileURLProvider } from '../../common/file-url-provider';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';
import { SaveAssessmentButton } from 'DetailsView/components/save-assessment-button';

export type SaveAssessmentFactoryDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
}

export type SaveAssessmentFactoryProps = CommandBarProps & {
    deps: SaveAssessmentFactoryDeps;
}

export function getReportForAssessment(props: SaveAssessmentFactoryProps): JSX.Element {
    return <SaveAssessmentButton />
}

export function getReportForFastPass(props: SaveAssessmentFactoryProps): JSX.Element | null {
    return null
}
