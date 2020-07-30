// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { NamedFC } from 'common/react/named-fc';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';
import { GenericDialog } from './generic-dialog';

export type StartOverDialogState = 'none' | 'assessment' | 'test';
export type DialogStateSetter = (dialogState: StartOverDialogState) => void;

export type StartOverDialogDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
};

export interface StartOverDialogProps {
    deps: StartOverDialogDeps;
    assessmentStoreData: AssessmentStoreData;
    assessmentsProvider: AssessmentsProvider;
    dialogState: StartOverDialogState;
    setDialogState: DialogStateSetter;
}

export const StartOverDialog = NamedFC<StartOverDialogProps>('StartOverDialog', props => {
    const { dialogState, deps, assessmentStoreData, assessmentsProvider, setDialogState } = props;

    if (dialogState === 'none') {
        return null;
    }

    const test = assessmentStoreData.assessmentNavState.selectedTestType;
    const testName = assessmentsProvider.forType(test).title;
    const requirementKey = assessmentStoreData.assessmentNavState.selectedTestSubview;

    const closeDialog = () => setDialogState('none');

    const onStartTestOver = (event: React.MouseEvent<any>): void => {
        deps.detailsViewActionMessageCreator.startOverTest(event, test);
        closeDialog();
    };

    const onStartOverAllTests = (event: React.MouseEvent<any>): void => {
        deps.detailsViewActionMessageCreator.startOverAllAssessments(event);
        closeDialog();
    };

    const onCancelStartOver = (event: React.MouseEvent<any>) => {
        deps.detailsViewActionMessageCreator.cancelStartOver(event, test, requirementKey);
        closeDialog();
    };

    const onCancelStartOverAllTests = (event: React.MouseEvent<any>) => {
        deps.detailsViewActionMessageCreator.cancelStartOverAllAssessments(event);
        closeDialog();
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

    const dialogProps = dialogPropsOptions[dialogState];

    return <GenericDialog title="Start over" primaryButtonText="Start over" {...dialogProps} />;
});
