// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { mount, shallow } from 'enzyme';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Dialog } from 'office-ui-fabric-react/lib/Dialog';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import { FileIssueDetailsDialog, FileIssueDetailsDialogProps } from '../../../../../common/components/file-issue-details-dialog';
import { FileIssueDetailsHandler } from '../../../../../common/file-issue-details-handler';

describe('FileIssueDetailsDialog', () => {
    let fileIssueDetailsHandlerMock: IMock<FileIssueDetailsHandler>;
    beforeEach(() => {
        fileIssueDetailsHandlerMock = Mock.ofType(FileIssueDetailsHandler);
        fileIssueDetailsHandlerMock.setup(handler => handler.onLayoutDidMount()).verifiable();
    });

    it('renders as expected', () => {
        const props: FileIssueDetailsDialogProps = {
            isOpen: true,
            buttonRef: null,
            getSettingsPanel: null,
            onDismiss: null,
            onOpenSettings: null,
            fileIssueDetailsHandler: fileIssueDetailsHandlerMock.object,
        };

        const wrapper = shallow(<FileIssueDetailsDialog {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('render while open', () => {
        const props: FileIssueDetailsDialogProps = {
            isOpen: true,
            buttonRef: null,
            getSettingsPanel: null,
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
            buttonRef: null,
            getSettingsPanel: null,
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
            buttonRef: null,
            getSettingsPanel: null,
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
            buttonRef: null,
            getSettingsPanel: null,
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
            buttonRef: null,
            getSettingsPanel: null,
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
