// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import Dialog from 'office-ui-fabric-react';
import * as React from 'react';

import {
    GenericDialog,
    GenericDialogProps,
} from '../../../../../DetailsView/components/generic-dialog';

describe('GenericDialogTest', () => {
    it('should render', () => {
        const props: GenericDialogProps = {
            title: 'test title',
            onCancelButtonClick: () => {},
            onPrimaryButtonClick: () => {},
            messageText: 'test message',
            primaryButtonText: 'test primary text',
        };

        const rendered = shallow(<GenericDialog {...props} />);

        expect(rendered.debug()).toMatchSnapshot();
    });

    it('should render with isHidden=true', () => {
        const props: GenericDialogProps = {
            title: 'test title',
            onCancelButtonClick: () => {},
            onPrimaryButtonClick: () => {},
            messageText: 'test message',
            primaryButtonText: 'test primary text',
            isHidden: true,
        };

        const rendered = shallow(<GenericDialog {...props} />);

        expect(rendered.debug()).toMatchSnapshot();
    });

    it('should handle onDismiss properly', () => {
        const onDismissMock = jest.fn();

        const props: GenericDialogProps = {
            title: 'test title',
            onPrimaryButtonClick: null,
            onCancelButtonClick: onDismissMock,
            messageText: 'test message',
            primaryButtonText: 'test primary text',
        };

        const rendered = shallow(<GenericDialog {...props} />);
        rendered.find(DefaultButton).simulate('click');

        expect(onDismissMock).toHaveBeenCalledTimes(1);
    });

    it('should handle afterDismissed properly', () => {
        const afterDismissedMock = jest.fn();

        const props: GenericDialogProps = {
            title: 'test title',
            onPrimaryButtonClick: null,
            onCancelButtonClick: () => null,
            messageText: 'test message',
            primaryButtonText: 'test primary text',
            afterDismissed: afterDismissedMock,
        };

        const rendered = shallow(<GenericDialog {...props} />);
        const modalProps = rendered.find(Dialog).prop('modalProps');
        modalProps.onDismissed();

        expect(afterDismissedMock).toHaveBeenCalledTimes(1);
    });

    it('should handle onStartOver properly', () => {
        const onPrimaryButtonClickMock = jest.fn();

        const props: GenericDialogProps = {
            title: 'test title',
            onCancelButtonClick: null,
            onPrimaryButtonClick: onPrimaryButtonClickMock,
            messageText: 'test message',
            primaryButtonText: 'test primary text',
        };

        const rendered = shallow(<GenericDialog {...props} />);
        rendered.find(PrimaryButton).simulate('click');

        expect(onPrimaryButtonClickMock).toHaveBeenCalledTimes(1);
    });

    it('should properly handle dialog dismiss', () => {
        const onCancelButtonClickMock = jest.fn();

        const props: GenericDialogProps = {
            title: 'test title',
            onPrimaryButtonClick: null,
            onCancelButtonClick: onCancelButtonClickMock,
            messageText: 'test message',
            primaryButtonText: 'test primary text',
        };

        const rendered = shallow(<GenericDialog {...props} />);
        rendered.find(Dialog).prop('onDismiss')();

        expect(onCancelButtonClickMock).toHaveBeenCalledTimes(1);
    });
});
