// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Dialog } from 'office-ui-fabric-react/lib/Dialog';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { WindowUtils } from 'src/common/window-utils';
import { It, Mock, MockBehavior, Times, IMock } from 'typemoq';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { ExportDialog, ExportDialogProps } from '../../../../../DetailsView/components/export-dialog';

describe('ExportDialog', () => {
    const onCloseMock = Mock.ofInstance(() => {});
    const onDescriptionChangeMock = Mock.ofInstance((value: string) => {});
    const actionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator, MockBehavior.Strict);
    const windowUtilsMock = Mock.ofType<WindowUtils>();
    const eventStub = 'event stub' as any;
    const onExportClickMock = Mock.ofInstance(() => {});
    let props: ExportDialogProps;
    let provideURLMock: IMock<(blobParts?: any[], mimeType?: string) => string>;

    beforeEach(() => {
        onCloseMock.reset();
        onDescriptionChangeMock.reset();
        actionMessageCreatorMock.reset();
        onExportClickMock.reset();
        provideURLMock = Mock.ofInstance(blobParts, mimeType => '');

        const deps = {
            detailsViewActionMessageCreator: actionMessageCreatorMock.object,
            windowUtils: windowUtilsMock.object,
        };

        props = {
            deps,
            isOpen: false,
            html: 'fake html',
            fileName: 'THE REPORT FILE NAME',
            description: 'description',
            onClose: onCloseMock.object,
            onDescriptionChange: onDescriptionChangeMock.object,
            actionMessageCreator: actionMessageCreatorMock.object,
            exportResultsType: 'Assessment',
            onExportClick: onExportClickMock.object,
        };
    });

    describe('renders', () => {
        const isOpenOptions = [true, false];

        it.each(isOpenOptions)('with open %p', isOpen => {
            props.isOpen = isOpen;
            provideURLMock
                .setup(pro => pro(It.isAny(), It.isAnyString()))
                .returns('fake-url')
                .verifiable(Times.once());
            const wrapper = shallow(<ExportDialog {...props} />);
            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });
    describe('user interaction', () => {
        it('closes the dialog onDismiss', () => {
            onCloseMock.setup(oc => oc()).verifiable(Times.once());
            onExportClickMock.setup(getter => getter()).verifiable(Times.never());
            const wrapper = shallow(<ExportDialog {...props} />);

            wrapper.find(Dialog).prop('onDismiss')();

            onCloseMock.verifyAll();
            onDescriptionChangeMock.verifyAll();
            actionMessageCreatorMock.verifyAll();
            onExportClickMock.verifyAll();
        });

        it('handles click on export button', () => {
            onCloseMock.setup(oc => oc()).verifiable(Times.once());
            onExportClickMock.setup(getter => getter()).verifiable(Times.once());

            actionMessageCreatorMock
                .setup(a => a.exportResultsClicked(props.exportResultsType, props.html, eventStub))
                .verifiable(Times.once());

            const wrapper = shallow(<ExportDialog {...props} />);

            wrapper.find(PrimaryButton).simulate('click', eventStub);

            onCloseMock.verifyAll();
            onDescriptionChangeMock.verifyAll();
            actionMessageCreatorMock.verifyAll();
            onExportClickMock.verifyAll();
        });

        it('handles text changes for the description', () => {
            props.isOpen = true;
            const changedDescription = 'changed-description';
            onDescriptionChangeMock.setup(handler => handler(It.isValue(changedDescription))).verifiable(Times.once());

            const wrapper = shallow(<ExportDialog {...props} />);

            const textField = wrapper.find(TextField);
            textField.simulate('change', eventStub, changedDescription);

            onCloseMock.verifyAll();
            onDescriptionChangeMock.verifyAll();
            actionMessageCreatorMock.verifyAll();
            onExportClickMock.verifyAll();
        });
    });
});
