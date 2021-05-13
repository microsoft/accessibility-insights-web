// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDataFormatter } from 'common/assessment-data-formatter';
import { FileNameBuilder } from 'common/filename-builder';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import {
    SaveAssessmentButton,
    SaveAssessmentButtonDeps,
} from 'DetailsView/components/save-assessment-button';
import * as React from 'react';
import { FileURLProvider } from '../../common/file-url-provider';

export type SaveAssessmentButtonFactoryDeps = {
    getCurrentDate: () => Date;
    fileURLProvider: FileURLProvider;
    fileNameBuilder: FileNameBuilder;
    assessmentDataFormatter: AssessmentDataFormatter;
} & SaveAssessmentButtonDeps;

export type SaveAssessmentButtonFactoryProps = {
    deps: SaveAssessmentButtonFactoryDeps;
    assessmentStoreData: AssessmentStoreData;
    tabStoreData: TabStoreData;
};

export function getSaveButtonForAssessment(props: SaveAssessmentButtonFactoryProps): JSX.Element {
    const assessmentData = props.deps.assessmentDataFormatter.formatAssessmentData(
        props.assessmentStoreData,
    );

    const currentDate = props.deps.getCurrentDate();
    const fileDate = props.deps.fileNameBuilder.getDateSegment(currentDate);
    const targetPageTitle = props.tabStoreData.title;
    const fileTitle = props.deps.fileNameBuilder.getTitleSegment(targetPageTitle);
    const fileName = `SavedAssessment_${fileDate}_${fileTitle}.a11ywebassessment`;
    const fileURL = props.deps.fileURLProvider.provideURL([assessmentData], 'application/json');

    return <SaveAssessmentButton download={fileName} href={fileURL} {...props} />;
}

export function getSaveButtonForFastPass(
    props: SaveAssessmentButtonFactoryProps,
): JSX.Element | null {
    return null;
}
