// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { CommandBarProps } from 'DetailsView/components/details-view-command-bar';
import { FileURLProvider } from '../../common/file-url-provider';
import { SaveAssessmentButton } from 'DetailsView/components/save-assessment-button';

export type SaveAssessmentFactoryDeps = {
    fileURLProvider: FileURLProvider,
    // assessmentDataFormatter: AssessmentDataFormatter;
};

export type SaveAssessmentFactoryProps = CommandBarProps & {
    deps: SaveAssessmentFactoryDeps;
};

export function getSaveButtonForAssessment(props: SaveAssessmentFactoryProps): JSX.Element {
    const html = JSON.stringify(props.assessmentStoreData.assessments);
    const fileURL = props.deps.fileURLProvider.provideURL([html], 'text/html');

    return (
        <SaveAssessmentButton
            download={'filename'}
            href={fileURL}
        />
    );
}

export function getSaveButtonForFastPass(props: SaveAssessmentFactoryProps): JSX.Element | null {
    return null;
}
