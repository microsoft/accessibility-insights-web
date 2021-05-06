// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDataFormatter } from 'common/assessment-data-formatter';
import { FlaggedComponent } from 'common/components/flagged-component';
import { FeatureFlags } from 'common/feature-flags';
import { FileNameBuilder } from 'common/filename-builder';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import {
    SaveAssessmentButton,
    SaveAssessmentButtonDeps,
} from 'DetailsView/components/save-assessment-button';
import * as React from 'react';
import { FileURLProvider } from '../../common/file-url-provider';

export type SaveAssessmentFactoryDeps = {
    getCurrentDate: () => Date;
    fileURLProvider: FileURLProvider;
    fileNameBuilder: FileNameBuilder;
    assessmentDataFormatter: AssessmentDataFormatter;
} & SaveAssessmentButtonDeps;

export type SaveAssessmentFactoryProps = {
    deps: SaveAssessmentFactoryDeps;
    assessmentStoreData: AssessmentStoreData;
    tabStoreData: TabStoreData;
    featureFlagStoreData: FeatureFlagStoreData;
};

export function getSaveButtonForAssessment(props: SaveAssessmentFactoryProps): JSX.Element {
    const assessmentData = props.deps.assessmentDataFormatter.formatAssessmentData(
        props.assessmentStoreData,
    );

    const currentDate = props.deps.getCurrentDate();
    const fileDate = props.deps.fileNameBuilder.getDateSegment(currentDate);
    const targetPageTitle = props.tabStoreData.title;
    const fileTitle = props.deps.fileNameBuilder.getTitleSegment(targetPageTitle);
    const fileName = `SavedAssessment_${fileDate}_${fileTitle}.a11ywebassessment`;
    const fileURL = props.deps.fileURLProvider.provideURL([assessmentData], 'application/json');

    return (
        <FlaggedComponent
            featureFlag={FeatureFlags.saveAndLoadAssessment}
            featureFlagStoreData={props.featureFlagStoreData}
            enableJSXElement={
                <SaveAssessmentButton download={fileName} href={fileURL} {...props} />
            }
        />
    );
}

export function getSaveButtonForFastPass(props: SaveAssessmentFactoryProps): JSX.Element | null {
    return null;
}
