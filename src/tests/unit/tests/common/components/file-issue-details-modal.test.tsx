// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { mount, shallow } from 'enzyme';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';

import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { FileIssueDetailsModal, FileIssueDetailsModalProps } from '../../../../../common/components/file-issue-details-modal';
import { FileIssueDetailsHandler } from '../../../../../common/file-issue-details-handler';
import { ActionAndCancelButtonsComponent } from '../../../../../DetailsView/components/action-and-cancel-buttons-component';

describe('FileIssueDetailsModalTest', () => {
    let fileIssueDetailsHandlerMock: IMock<FileIssueDetailsHandler>;
    beforeEach(() => {
        fileIssueDetailsHandlerMock = Mock.ofType(FileIssueDetailsHandler);
        fileIssueDetailsHandlerMock
            .setup(handler => handler.onLayoutDidMount())
            .verifiable();
    });

    test('render while open', () => {
        const props: FileIssueDetailsModalProps = {
            isOpen: true,
            onDismiss: null,
            onOpenSettings: null,
            fileIssueDetailsHandler: fileIssueDetailsHandlerMock.object,
        };

        // Full render in order to properly trigger `onLayerDidMount`
        const wrapper = mount(<FileIssueDetailsModal {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
        fileIssueDetailsHandlerMock.verifyAll();
    });

    test('render while closed', () => {
        const fileIssueDetailsHandlerMockLocal = Mock.ofType(FileIssueDetailsHandler);
        fileIssueDetailsHandlerMockLocal
            .setup(handler => handler.onLayoutDidMount())
            .verifiable(Times.never());

        const props: FileIssueDetailsModalProps = {
            isOpen: false,
            onDismiss: null,
            onOpenSettings: null,
            fileIssueDetailsHandler: fileIssueDetailsHandlerMockLocal.object,
        };

        // Full render in order to properly trigger `onLayerDidMount`
        const wrapper = mount(<FileIssueDetailsModal {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
        fileIssueDetailsHandlerMockLocal.verifyAll();
    });

    test('onOpenSettings', () => {
        const openSettingsMock = jest.fn();

        const props: FileIssueDetailsModalProps = {
            isOpen: true,
            onDismiss: null,
            onOpenSettings: openSettingsMock,
            fileIssueDetailsHandler: fileIssueDetailsHandlerMock.object,
        };
        const wrapper = shallow(<FileIssueDetailsModal {...props} />);

        wrapper
            .find(ActionAndCancelButtonsComponent)
            .props()
            .primaryButtonOnClick(null);
        expect(openSettingsMock).toBeCalled();
    });

    test('onDismiss via button', () => {
        const onDismissMock = jest.fn();

        const props: FileIssueDetailsModalProps = {
            isOpen: true,
            onDismiss: onDismissMock,
            onOpenSettings: null,
            fileIssueDetailsHandler: fileIssueDetailsHandlerMock.object,
        };
        const wrapper = shallow(<FileIssueDetailsModal {...props} />);

        wrapper
            .find(ActionAndCancelButtonsComponent)
            .props()
            .cancelButtonOnClick(null);
        expect(onDismissMock).toBeCalled();
    });

    test('onDismiss via click off modal', () => {
        const onDismissMock = jest.fn();

        const props: FileIssueDetailsModalProps = {
            isOpen: true,
            onDismiss: onDismissMock,
            onOpenSettings: null,
            fileIssueDetailsHandler: fileIssueDetailsHandlerMock.object,
        };
        const wrapper = shallow(<FileIssueDetailsModal {...props} />);

        wrapper
            .find(Modal)
            .props()
            .onDismiss(null);
        expect(onDismissMock).toBeCalled();
    });
});
