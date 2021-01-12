// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { NamedFC } from 'common/react/named-fc';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import * as React from 'react';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';
import { GenericDialog } from './generic-dialog';

export type StartOverDialogType = 'assessment' | 'test';
export const dialogClosedState = 'none';
export type StartOverDialogState = StartOverDialogType | typeof dialogClosedState;

export type StartOverDialogDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
};

export interface StartOverDialogProps {
    deps: StartOverDialogDeps;
    assessmentStoreData: AssessmentStoreData;
    assessmentsProvider: AssessmentsProvider;
    dialogState: StartOverDialogState;
    dismissDialog: () => void;
}

export const StartOverDialog = NamedFC<StartOverDialogProps>('StartOverDialog', props => {
    const { dialogState, deps, assessmentStoreData, assessmentsProvider, dismissDialog } = props;

    if (dialogState === dialogClosedState) {
        return null;
    }

    const test = assessmentStoreData.assessmentNavState.selectedTestType;
    const testName = assessmentsProvider.forType(test).title;
    const requirementKey = assessmentStoreData.assessmentNavState.selectedTestSubview;

    const onStartTestOver = (event: React.MouseEvent<any>): void => {
        deps.detailsViewActionMessageCreator.startOverTest(event, test);
        dismissDialog();
    };

    const onStartOverAllTests = (event: React.MouseEvent<any>): void => {
        deps.detailsViewActionMessageCreator.startOverAllAssessments(event);
        dismissDialog();
    };

    const onCancelStartOver = (event: React.MouseEvent<any>) => {
        deps.detailsViewActionMessageCreator.cancelStartOver(event, test, requirementKey);
        dismissDialog();
    };

    const onCancelStartOverAllTests = (event: React.MouseEvent<any>) => {
        deps.detailsViewActionMessageCreator.cancelStartOverAllAssessments(event);
        dismissDialog();
    };

    const dialogPropsOptions = {
        assessment: {
            messageText:
                'Starting over will clear all existing results from the Assessment. ' +
                'This will clear results and progress of all tests and requirements. ' +
                'Are you sure you want to start over?',
            onPrimaryButtonClick: onStartOverAllTests,
            onCancelButtonClick: onCancelStartOverAllTests,
        },
        test: {
            messageText: `Starting over will clear all existing results from the ${testName} test. Are you sure you want to start over?`,
            onPrimaryButtonClick: onStartTestOver,
            onCancelButtonClick: onCancelStartOver,
        },
    };

    const dialogProps = {
        ...dialogPropsOptions[dialogState],
        title: 'Start over',
        primaryButtonText: 'Start over',
        isHidden: props.dialogState === dialogClosedState,
    };

    return <GenericDialog {...dialogProps} />;
});
