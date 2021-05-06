// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Tab } from 'common/itab';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';
import {
    LoadAssessmentDialog,
    LoadAssessmentDialogDeps,
} from 'DetailsView/components/load-assessment-dialog';
import * as React from 'react';

export type LoadAssessmentDialogFactoryDeps = LoadAssessmentDialogDeps;

export type LoadAssessmentDialogFactoryProps = {
    deps: LoadAssessmentDialogFactoryDeps;
    assessmentStoreData: AssessmentStoreData;
    tabStoreData: TabStoreData;
    isOpen: boolean;
    prevTab: Tab;
    loadedAssessmentData: VersionedAssessmentData;
    tabId: number;
    onClose: () => void;
};

export function getLoadAssessmentDialogForAssessment(
    props: LoadAssessmentDialogFactoryProps,
): JSX.Element {
    return <LoadAssessmentDialog {...props} />;
}

export function getLoadAssessmentDialogForFastPass(
    props: LoadAssessmentDialogFactoryProps,
): JSX.Element | null {
    return null;
}
