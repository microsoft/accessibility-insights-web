// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import {
    StartOverDialog,
    StartOverDialogProps,
    StartOverDialogState,
} from 'DetailsView/components/start-over-dialog';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';

describe('StartOverDialog', () => {
    let props: StartOverDialogProps;
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
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
        detailsViewActionMessageCreatorMock = Mock.ofType<DetailsViewActionMessageCreator>();
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
                detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
            },
            assessmentStoreData,
            assessmentsProvider: assessmentsProviderMock.object,
            dismissDialog: dismissDialogMock.object,
        } as StartOverDialogProps;
    });

    it.each(['none', 'test', 'assessment'] as StartOverDialogState[])(
        'renders when dialogState = %s',
        dialogState => {
            props.dialogState = dialogState;

            const wrapper = shallow(<StartOverDialog {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        },
    );

    describe('with dialogState = test', () => {
        beforeEach(() => {
            props.dialogState = 'test';
        });

        it('dismiss dialog', () => {
            detailsViewActionMessageCreatorMock
                .setup(creator => creator.cancelStartOver(event, test, requirementKey))
                .verifiable(Times.once());
            dismissDialogMock.setup(cd => cd()).verifiable(Times.once());

            const wrapper = shallow(<StartOverDialog {...props} />);
            wrapper.prop('onCancelButtonClick')(event);

            detailsViewActionMessageCreatorMock.verifyAll();
            dismissDialogMock.verifyAll();
        });

        it('start over test', () => {
            detailsViewActionMessageCreatorMock
                .setup(creator => creator.startOverTest(event, test))
                .verifiable(Times.once());
            dismissDialogMock.setup(cd => cd()).verifiable(Times.once());

            const wrapper = shallow(<StartOverDialog {...props} />);
            wrapper.prop('onPrimaryButtonClick')(event);

            detailsViewActionMessageCreatorMock.verifyAll();
            dismissDialogMock.verifyAll();
        });
    });

    describe('with dialogState = assessment', () => {
        beforeEach(() => {
            props.dialogState = 'assessment';
        });

        it('dismiss dialog', () => {
            detailsViewActionMessageCreatorMock
                .setup(creator => creator.cancelStartOverAllAssessments(event))
                .verifiable(Times.once());
            dismissDialogMock.setup(cd => cd()).verifiable(Times.once());

            const wrapper = shallow(<StartOverDialog {...props} />);
            wrapper.prop('onCancelButtonClick')(event);

            detailsViewActionMessageCreatorMock.verifyAll();
            dismissDialogMock.verifyAll();
        });

        it('start over assessment', () => {
            detailsViewActionMessageCreatorMock
                .setup(creator => creator.startOverAllAssessments(event))
                .verifiable(Times.once());
            dismissDialogMock.setup(cd => cd()).verifiable(Times.once());

            const wrapper = shallow(<StartOverDialog {...props} />);
            wrapper.prop('onPrimaryButtonClick')(event);

            detailsViewActionMessageCreatorMock.verifyAll();
            dismissDialogMock.verifyAll();
        });
    });
});
