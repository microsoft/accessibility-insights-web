// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { CommandBarProps } from 'DetailsView/components/details-view-command-bar';
import { FileURLProvider } from '../../common/file-url-provider';
import { SaveAssessmentButton } from 'DetailsView/components/save-assessment-button';
import { AssessmentDataFormatter } from 'common/assessment-data-formatter';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';

export type SaveAssessmentFactoryDeps = {
    fileURLProvider: FileURLProvider;
    assessmentDataFormatter: AssessmentDataFormatter;
};

export type SaveAssessmentFactoryProps = {
    deps: SaveAssessmentFactoryDeps;
    assessmentStoreData: AssessmentStoreData;
};

export function getSaveButtonForAssessment(props: SaveAssessmentFactoryProps): JSX.Element {
    const assessmentData = props.deps.assessmentDataFormatter.formatAssessmentData(
        props.assessmentStoreData.assessments,
    );
    const fileURL = props.deps.fileURLProvider.provideURL([assessmentData], 'text/html');

    return <SaveAssessmentButton download={'filename'} href={fileURL} />;
}

export function getSaveButtonForFastPass(props: SaveAssessmentFactoryProps): JSX.Element | null {
    return null;
}
