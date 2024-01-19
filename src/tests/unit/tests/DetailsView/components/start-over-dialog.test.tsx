// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { fireEvent, render } from '@testing-library/react';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import {
    StartOverDialog,
    StartOverDialogProps,
    StartOverDialogState,
} from 'DetailsView/components/start-over-dialog';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';
import { VisualizationType } from '../../../../../common/types/visualization-type';

describe('StartOverDialog', () => {
    let props: StartOverDialogProps;
    let assessmentActionMessageCreatorMock: IMock<AssessmentActionMessageCreator>;
    let dismissDialogMock: IMock<() => void>;
    let assessmentsProviderMock: IMock<AssessmentsProvider>;
    let assessmentStoreData: AssessmentStoreData;

    const event = {
        currentTarget: 'test target',
    } as React.MouseEvent<any>;
    const testName = 'test name';
    const test = -1 as VisualizationType;
    const requirementKey = 'test key';
    const assessmentStub = {
        title: testName,
    } as Assessment;

    beforeEach(() => {
        assessmentActionMessageCreatorMock = Mock.ofType<AssessmentActionMessageCreator>();
        dismissDialogMock = Mock.ofInstance(() => null);
        assessmentsProviderMock = Mock.ofType<AssessmentsProvider>();
        assessmentsProviderMock.setup(ap => ap.forType(test)).returns(() => assessmentStub);
        assessmentStoreData = {
            assessmentNavState: {
                selectedTestSubview: requirementKey,
                selectedTestType: test,
            },
        } as AssessmentStoreData;
        props = {
            deps: {
                getAssessmentActionMessageCreator: () => assessmentActionMessageCreatorMock.object,
                getProvider: () => assessmentsProviderMock.object,
            },
            assessmentStoreData,
            dismissDialog: dismissDialogMock.object,
        } as StartOverDialogProps;
    });

    it.each(['none', 'test', 'assessment'] as StartOverDialogState[])(
        'renders when dialogState = %s',
        dialogState => {
            props.dialogState = dialogState;

            const renderResult = render(<StartOverDialog {...props} />);

            expect(renderResult.asFragment()).toMatchSnapshot();
        },
    );

    describe('with dialogState = test', () => {
        beforeEach(() => {
            props.dialogState = 'test';
        });

        it('dismiss dialog', () => {
            assessmentActionMessageCreatorMock
                .setup(creator => creator.cancelStartOver(It.isAny(), It.isAny(), It.isAny()))
                .verifiable(Times.once());
            dismissDialogMock.setup(cd => cd()).verifiable(Times.once());

            const renderResult = render(<StartOverDialog {...props} />);

            const onClick = renderResult.getAllByRole('button');
            fireEvent.click(onClick[1]);
            assessmentActionMessageCreatorMock.verifyAll();
            dismissDialogMock.verifyAll();
        });

        it('start over test', () => {
            assessmentActionMessageCreatorMock
                .setup(creator => creator.startOverTest(It.isAny(), It.isAny()))
                .verifiable(Times.once());
            dismissDialogMock.setup(cd => cd()).verifiable(Times.once());

            const renderResult = render(<StartOverDialog {...props} />);

            const onClick = renderResult.getAllByRole('button');
            fireEvent.click(onClick[0]);
            assessmentActionMessageCreatorMock.verifyAll();
            dismissDialogMock.verifyAll();
        });
    });

    describe('with dialogState = assessment', () => {
        beforeEach(() => {
            props.dialogState = 'assessment';
        });

        it('dismiss dialog', () => {
            assessmentActionMessageCreatorMock
                .setup(creator => creator.cancelStartOverAllAssessments(It.isAny()))
                .verifiable(Times.once());
            dismissDialogMock.setup(cd => cd()).verifiable(Times.once());

            const renderResult = render(<StartOverDialog {...props} />);

            const onClick = renderResult.getAllByRole('button');
            fireEvent.click(onClick[1]);
            assessmentActionMessageCreatorMock.verifyAll();
            dismissDialogMock.verifyAll();
        });

        it('start over assessment', () => {
            assessmentActionMessageCreatorMock
                .setup(creator => creator.startOverAllAssessments(It.isAny()))
                .verifiable(Times.once());
            dismissDialogMock.setup(cd => cd()).verifiable(Times.once());

            const renderResult = render(<StartOverDialog {...props} />);

            const onClick = renderResult.getAllByRole('button');
            fireEvent.click(onClick[0]);

            assessmentActionMessageCreatorMock.verifyAll();
            dismissDialogMock.verifyAll();
        });
    });
});
