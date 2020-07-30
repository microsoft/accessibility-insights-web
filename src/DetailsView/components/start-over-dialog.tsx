// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from 'common/react/named-fc';
import { VisualizationType } from '../../common/types/visualization-type';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';
import { GenericDialog } from './generic-dialog';

export type StartOverDialogState = 'none' | 'assessment' | 'test';
export type DialogStateSetter = (dialogState: StartOverDialogState) => void;

export type StartOverDialogDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
};

export interface StartOverDialogProps {
    deps: StartOverDialogDeps;
    testName: string;
    test: VisualizationType;
    requirementKey: string;
    dialogState: StartOverDialogState;
    setDialogState: DialogStateSetter;
}

export const StartOverDialog = NamedFC<StartOverDialogProps>('StartOverDialog', props => {
    const { dialogState, deps, test, testName, requirementKey, setDialogState } = props;

    if (dialogState === 'none') {
        return null;
    }

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
