// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import {
    DialogStateSetter,
    StartOverDialog,
    StartOverDialogProps,
    StartOverDialogState,
} from 'DetailsView/components/start-over-dialog';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';

describe('StartOverDialog', () => {
    let props: StartOverDialogProps;
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let setDialogStateMock: IMock<DialogStateSetter>;

    const event = {
        currentTarget: 'test target',
    } as React.MouseEvent<any>;
    const testName = 'test name';
    const test = -1 as VisualizationType;
    const requirementKey = 'test key';

    beforeEach(() => {
        detailsViewActionMessageCreatorMock = Mock.ofType<DetailsViewActionMessageCreator>();
        setDialogStateMock = Mock.ofInstance(() => null);
        props = {
            deps: {
                detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
            },
            testName,
            test,
            requirementKey,
            setDialogState: setDialogStateMock.object,
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
            setDialogStateMock.setup(cd => cd('none')).verifiable(Times.once());

            const wrapper = shallow(<StartOverDialog {...props} />);
            wrapper.prop('onCancelButtonClick')(event);

            detailsViewActionMessageCreatorMock.verifyAll();
            setDialogStateMock.verifyAll();
        });

        it('start over test', () => {
            detailsViewActionMessageCreatorMock
                .setup(creator => creator.startOverTest(event, test))
                .verifiable(Times.once());
            setDialogStateMock.setup(cd => cd('none')).verifiable(Times.once());

            const wrapper = shallow(<StartOverDialog {...props} />);
            wrapper.prop('onPrimaryButtonClick')(event);

            detailsViewActionMessageCreatorMock.verifyAll();
            setDialogStateMock.verifyAll();
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
            setDialogStateMock.setup(cd => cd('none')).verifiable(Times.once());

            const wrapper = shallow(<StartOverDialog {...props} />);
            wrapper.prop('onCancelButtonClick')(event);

            detailsViewActionMessageCreatorMock.verifyAll();
            setDialogStateMock.verifyAll();
        });

        it('start over assessment', () => {
            detailsViewActionMessageCreatorMock
                .setup(creator => creator.startOverAllAssessments(event))
                .verifiable(Times.once());
            setDialogStateMock.setup(cd => cd('none')).verifiable(Times.once());

            const wrapper = shallow(<StartOverDialog {...props} />);
            wrapper.prop('onPrimaryButtonClick')(event);

            detailsViewActionMessageCreatorMock.verifyAll();
            setDialogStateMock.verifyAll();
        });
    });
});
