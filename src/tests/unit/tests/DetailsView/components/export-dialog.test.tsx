// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { PrimaryButton } from 'office-ui-fabric-react';
import { Dialog } from 'office-ui-fabric-react';
import { TextField } from 'office-ui-fabric-react';
import * as React from 'react';
import { It, Mock, MockBehavior, Times } from 'typemoq';
import { FileURLProvider } from '../../../../../common/file-url-provider';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import {
    ExportDialog,
    ExportDialogProps,
} from '../../../../../DetailsView/components/export-dialog';

describe('ExportDialog', () => {
    const onCloseMock = Mock.ofInstance(() => {});
    const onDescriptionChangeMock = Mock.ofInstance((value: string) => {});
    const detailsViewActionMessageCreatorMock = Mock.ofType(
        DetailsViewActionMessageCreator,
        MockBehavior.Strict,
    );
    const fileProviderMock = Mock.ofType<FileURLProvider>();
    const eventStub = 'event stub' as any;
    const onExportClickMock = Mock.ofInstance(() => {});
    let props: ExportDialogProps;

    beforeEach(() => {
        onCloseMock.reset();
        onDescriptionChangeMock.reset();
        detailsViewActionMessageCreatorMock.reset();
        onExportClickMock.reset();
        fileProviderMock.reset();

        const deps = {
            detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
            fileURLProvider: fileProviderMock.object,
        };

        props = {
            deps,
            isOpen: false,
            html: 'fake html',
            fileName: 'THE REPORT FILE NAME',
            description: 'description',
            onClose: onCloseMock.object,
            onDescriptionChange: onDescriptionChangeMock.object,
            exportResultsType: 'Assessment',
            onExportClick: onExportClickMock.object,
        };
    });

    describe('renders', () => {
        const isOpenOptions = [true, false];

        it.each(isOpenOptions)('with open %p', isOpen => {
            props.isOpen = isOpen;
            fileProviderMock
                .setup(provider => provider.provideURL(It.isAny(), It.isAnyString()))
                .returns(() => 'fake-url')
                .verifiable(Times.once());
            const wrapper = shallow(<ExportDialog {...props} />);
            expect(wrapper.getElement()).toMatchSnapshot();

            fileProviderMock.verifyAll();
        });
    });
    describe('user interaction', () => {
        it('closes the dialog onDismiss', () => {
            onCloseMock.setup(oc => oc()).verifiable(Times.once());
            fileProviderMock
                .setup(provider => provider.provideURL(It.isAny(), It.isAnyString()))
                .returns(() => 'fake-url')
                .verifiable(Times.once());
            onExportClickMock.setup(getter => getter()).verifiable(Times.never());
            const wrapper = shallow(<ExportDialog {...props} />);

            wrapper.find(Dialog).prop('onDismiss')();

            fileProviderMock.verifyAll();
            onCloseMock.verifyAll();
            onDescriptionChangeMock.verifyAll();
            detailsViewActionMessageCreatorMock.verifyAll();
            onExportClickMock.verifyAll();
        });

        it('handles click on export button', () => {
            const unchangedDescription = 'description';
            onDescriptionChangeMock
                .setup(dc => dc(It.isValue(unchangedDescription)))
                .verifiable(Times.once());

            onCloseMock.setup(oc => oc()).verifiable(Times.once());
            fileProviderMock
                .setup(provider => provider.provideURL(It.isAny(), It.isAnyString()))
                .returns(() => 'fake-url')
                .verifiable(Times.exactly(2));
            onExportClickMock.setup(getter => getter()).verifiable(Times.once());

            detailsViewActionMessageCreatorMock
                .setup(a => a.exportResultsClicked(props.exportResultsType, props.html, eventStub))
                .verifiable(Times.once());

            const wrapper = shallow(<ExportDialog {...props} />);

            wrapper.find(PrimaryButton).simulate('click', eventStub);

            fileProviderMock.verifyAll();
            onCloseMock.verifyAll();
            onDescriptionChangeMock.verifyAll();
            detailsViewActionMessageCreatorMock.verifyAll();
            onExportClickMock.verifyAll();
        });

        it('handles text changes for the description', () => {
            props.isOpen = true;
            fileProviderMock
                .setup(provider => provider.provideURL(It.isAny(), It.isAnyString()))
                .returns(() => 'fake-url')
                .verifiable(Times.once());
            const changedDescription = 'changed-description';
            onDescriptionChangeMock
                .setup(handler => handler(It.isValue(changedDescription)))
                .verifiable(Times.once());

            const wrapper = shallow(<ExportDialog {...props} />);

            const textField = wrapper.find(TextField);
            textField.simulate('change', eventStub, changedDescription);

            fileProviderMock.verifyAll();
            onCloseMock.verifyAll();
            onDescriptionChangeMock.verifyAll();
            detailsViewActionMessageCreatorMock.verifyAll();
            onExportClickMock.verifyAll();
        });
    });
});
