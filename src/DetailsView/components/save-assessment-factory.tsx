// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { CommandBarProps } from 'DetailsView/components/details-view-command-bar';
import { FileURLProvider } from '../../common/file-url-provider';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';

export type SaveAssessmentFactoryDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
    fileURLProvider: FileURLProvider;
}

export type SaveAssessmentFactoryProps = CommandBarProps & {
    deps: SaveAssessmentFactoryDeps;
}

export interface SaveAssessmentFactory {
    getAssessment: (props: SaveAssessmentFactoryProps) => void;
}

export function getReportForAssessment(props: SaveAssessmentFactoryProps) :void {
    const selectedTest = props.assessmentStoreData.assessmentNavState.selectedTestType
}

export function getReportForFastPass(props: SaveAssessmentFactoryProps) :void {
    const selectedTest = props.assessmentStoreData.assessmentNavState.selectedTestType
}
