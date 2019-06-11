// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Dialog } from 'office-ui-fabric-react/lib/Dialog';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { WindowUtils } from 'src/common/window-utils';
import { It, Mock, MockBehavior, Times } from 'typemoq';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { ExportDialog, ExportDialogProps } from '../../../../../DetailsView/components/export-dialog';

describe('ExportDialog', () => {
    const onCloseMock = Mock.ofInstance(() => {});
    const onDescriptionChangeMock = Mock.ofInstance((value: string) => {});
    const actionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator, MockBehavior.Strict);
    const windowUtilsMock = Mock.ofType<WindowUtils>();
    const provideBlobMock = Mock.ofType<(blobParts?: any[], mimeType?: string) => Blob>();
    const eventStub = 'event stub' as any;
    const blobStub = {} as Blob;
    let props: ExportDialogProps;

    beforeEach(() => {
        onCloseMock.reset();
        onDescriptionChangeMock.reset();
        actionMessageCreatorMock.reset();
        provideBlobMock.reset();

        const deps = {
            detailsViewActionMessageCreator: actionMessageCreatorMock.object,
            windowUtils: windowUtilsMock.object,
            provideBlob: provideBlobMock.object,
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
        };
    });

    describe('renders', () => {
        const isOpenOptions = [true, false];

        it.each(isOpenOptions)('with open %p', isOpen => {
            provideBlobMock
                .setup(p => p(It.isAny(), It.isAnyString()))
                .returns(() => blobStub)
                .verifiable(Times.once());
            windowUtilsMock
                .setup(w => w.createObjectURL(blobStub))
                .returns(() => 'fake-url')
                .verifiable(Times.once());
            props.isOpen = isOpen;
            const wrapper = shallow(<ExportDialog {...props} />);
            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });
    describe('user interaction', () => {
        it('closes the dialog onDismiss', () => {
            onCloseMock.setup(oc => oc()).verifiable(Times.once());
            provideBlobMock
                .setup(p => p(It.isAny(), It.isAnyString()))
                .returns(() => blobStub)
                .verifiable(Times.once());
            windowUtilsMock
                .setup(w => w.createObjectURL(blobStub))
                .returns(() => 'fake-url')
                .verifiable(Times.once());

            const wrapper = shallow(<ExportDialog {...props} />);

            wrapper.find(Dialog).prop('onDismiss')();

            onCloseMock.verifyAll();
            onDescriptionChangeMock.verifyAll();
            actionMessageCreatorMock.verifyAll();
        });

        it('handles click on export button', () => {
            onCloseMock.setup(oc => oc()).verifiable(Times.once());
            provideBlobMock
                .setup(p => p(It.isAny(), It.isAnyString()))
                .returns(() => blobStub)
                .verifiable(Times.once());
            windowUtilsMock
                .setup(w => w.createObjectURL(blobStub))
                .returns(() => 'fake-url')
                .verifiable(Times.once());

            actionMessageCreatorMock
                .setup(a => a.exportResultsClicked(props.exportResultsType, props.html, eventStub))
                .verifiable(Times.once());

            const wrapper = shallow(<ExportDialog {...props} />);

            wrapper.find(PrimaryButton).simulate('click', eventStub);

            onCloseMock.verifyAll();
            onDescriptionChangeMock.verifyAll();
            actionMessageCreatorMock.verifyAll();
        });

        it('handles text changes for the description', () => {
            props.isOpen = true;
            const changedDescription = 'changed-description';
            onDescriptionChangeMock.setup(handler => handler(It.isValue(changedDescription))).verifiable(Times.once());
            provideBlobMock
                .setup(p => p(It.isAny(), It.isAnyString()))
                .returns(() => blobStub)
                .verifiable(Times.once());
            windowUtilsMock
                .setup(w => w.createObjectURL(blobStub))
                .returns(() => 'fake-url')
                .verifiable(Times.once());

            const wrapper = shallow(<ExportDialog {...props} />);

            const textField = wrapper.find(TextField);
            textField.simulate('change', eventStub, changedDescription);

            onCloseMock.verifyAll();
            onDescriptionChangeMock.verifyAll();
            actionMessageCreatorMock.verifyAll();
        });
    });
});
