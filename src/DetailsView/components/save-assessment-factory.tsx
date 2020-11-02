// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { CommandBarProps } from 'DetailsView/components/details-view-command-bar';
import { FileURLProvider } from '../../common/file-url-provider';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';
import { SaveAssessmentButton } from 'DetailsView/components/save-assessment-button';

export type SaveAssessmentFactoryDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
    fileURLProvider: FileURLProvider;
}

export type SaveAssessmentFactoryProps = CommandBarProps & {
    deps: SaveAssessmentFactoryDeps;
}

export interface SaveAssessmentFactory {
    // getAssessment: (props: SaveAssessmentFactoryProps) => void;
}

export function getReportForAssessment(props: SaveAssessmentFactoryProps): JSX.Element {
    const selectedTest = props.assessmentStoreData.assessmentNavState.selectedTestType

    return <SaveAssessmentButton />
}

export function getReportForFastPass(props: SaveAssessmentFactoryProps) :void {
    const selectedTest = props.assessmentStoreData.assessmentNavState.selectedTestType
}
