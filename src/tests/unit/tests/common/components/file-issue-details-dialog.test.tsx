// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { mount, shallow } from 'enzyme';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';

import { Dialog } from 'office-ui-fabric-react/lib/Dialog';
import { FileIssueDetailsDialog, FileIssueDetailsDialogProps } from '../../../../../common/components/file-issue-details-dialog';
import { FileIssueDetailsHandler } from '../../../../../common/file-issue-details-handler';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';

describe('FileIssueDetailsDialogTest', () => {
    let fileIssueDetailsHandlerMock: IMock<FileIssueDetailsHandler>;
    beforeEach(() => {
        fileIssueDetailsHandlerMock = Mock.ofType(FileIssueDetailsHandler);
        fileIssueDetailsHandlerMock.setup(handler => handler.onLayoutDidMount()).verifiable();
    });

    test('render while open', () => {
        const props: FileIssueDetailsDialogProps = {
            isOpen: true,
            onDismiss: null,
            onOpenSettings: null,
            fileIssueDetailsHandler: fileIssueDetailsHandlerMock.object,
        };

        // Full render in order to properly trigger `onLayerDidMount`
        const wrapper = mount(<FileIssueDetailsDialog {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
        fileIssueDetailsHandlerMock.verifyAll();
    });

    test('render while closed', () => {
        const fileIssueDetailsHandlerMockLocal = Mock.ofType(FileIssueDetailsHandler);
        fileIssueDetailsHandlerMockLocal.setup(handler => handler.onLayoutDidMount()).verifiable(Times.never());

        const props: FileIssueDetailsDialogProps = {
            isOpen: false,
            onDismiss: null,
            onOpenSettings: null,
            fileIssueDetailsHandler: fileIssueDetailsHandlerMockLocal.object,
        };

        // Full render in order to properly trigger `onLayerDidMount`
        const wrapper = mount(<FileIssueDetailsDialog {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
        fileIssueDetailsHandlerMockLocal.verifyAll();
    });

    test('onOpenSettings', () => {
        const openSettingsMock = jest.fn();

        const props: FileIssueDetailsDialogProps = {
            isOpen: true,
            onDismiss: null,
            onOpenSettings: openSettingsMock,
            fileIssueDetailsHandler: fileIssueDetailsHandlerMock.object,
        };
        const wrapper = shallow(<FileIssueDetailsDialog {...props} />);

        wrapper
            .find(PrimaryButton)
            .props()
            .onClick(null);
        expect(openSettingsMock).toBeCalled();
    });

    test('onDismiss via button', () => {
        const onDismissMock = jest.fn();

        const props: FileIssueDetailsDialogProps = {
            isOpen: true,
            onDismiss: onDismissMock,
            onOpenSettings: null,
            fileIssueDetailsHandler: fileIssueDetailsHandlerMock.object,
        };
        const wrapper = shallow(<FileIssueDetailsDialog {...props} />);

        wrapper
            .find(DefaultButton)
            .props()
            .onClick(null);
        expect(onDismissMock).toBeCalled();
    });

    test('onDismiss via click off dialog', () => {
        const onDismissMock = jest.fn();

        const props: FileIssueDetailsDialogProps = {
            isOpen: true,
            onDismiss: onDismissMock,
            onOpenSettings: null,
            fileIssueDetailsHandler: fileIssueDetailsHandlerMock.object,
        };
        const wrapper = shallow(<FileIssueDetailsDialog {...props} />);

        wrapper
            .find(Dialog)
            .props()
            .onDismiss(null);
        expect(onDismissMock).toBeCalled();
    });
});
