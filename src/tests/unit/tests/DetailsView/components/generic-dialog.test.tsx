// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { userEvent } from '@testing-library/user-event';

import { fireEvent, render } from '@testing-library/react';
import { DefaultButton, PrimaryButton } from '@fluentui/react';
import { Dialog } from '@fluentui/react';
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

        const renderResult = render(<GenericDialog {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('should handle onDismiss properly', async () => {
        const onDismissMock = jest.fn();

        const props: GenericDialogProps = {
            title: 'test title',
            onPrimaryButtonClick: null,
            onCancelButtonClick: onDismissMock,
            messageText: 'test message',
            primaryButtonText: 'test primary text',
        };

        const renderResult = render(<GenericDialog {...props} />);
        const button = renderResult.getByRole('button', { name: /Cancel/i });
        fireEvent.click(button);

        expect(onDismissMock).toHaveBeenCalledTimes(1);
    });

    it('should handle onStartOver properly', async () => {
        const onPrimaryButtonClickMock = jest.fn();

        const props: GenericDialogProps = {
            title: 'test title',
            onCancelButtonClick: null,
            onPrimaryButtonClick: onPrimaryButtonClickMock,
            messageText: 'test message',
            primaryButtonText: 'test primary text',
        };

        const renderResult = render(<GenericDialog {...props} />);
        const button = renderResult.getByRole('button', { name: /test primary text/i });
        fireEvent.click(button);

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

        //const renderResult = render(<GenericDialog {...props} />);
        //renderResult.container.querySelector(Dialog).prop('onDismiss')();

        const renderResult = render(<GenericDialog {...props} />);
        const button = renderResult.getByRole('button', { name: /Cancel/i });
        fireEvent.click(button);

        expect(onCancelButtonClickMock).toHaveBeenCalledTimes(1);
    });
});
