// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Dialog, DefaultButton, DialogFooter, PrimaryButton } from '@fluentui/react';
import { fireEvent, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import * as React from 'react';

import {
    GenericDialog,
    GenericDialogProps,
} from '../../../../../DetailsView/components/generic-dialog';
import {
    mockReactComponents,
    useOriginalReactElements,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('@fluentui/react');
describe('GenericDialogTest', () => {
    mockReactComponents([Dialog, DialogFooter, PrimaryButton, DefaultButton]);

    it('should render', () => {
        const props: GenericDialogProps = {
            title: 'test title',
            onCancelButtonClick: () => {},
            onPrimaryButtonClick: () => {},
            messageText: 'test message',
            primaryButtonText: 'test primary text',
        };

        useOriginalReactElements('@fluentui/react', [
            'Dialog',
            'DialogFooter',
            'PrimaryButton',
            'DefaultButton',
        ]);
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

        useOriginalReactElements('@fluentui/react', [
            'Dialog',
            'DialogFooter',
            'PrimaryButton',
            'DefaultButton',
        ]);
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
        useOriginalReactElements('@fluentui/react', [
            'Dialog',
            'DialogFooter',
            'PrimaryButton',
            'DefaultButton',
        ]);
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
        useOriginalReactElements('@fluentui/react', [
            'Dialog',
            'DialogFooter',
            'PrimaryButton',
            'DefaultButton',
        ]);
        const renderResult = render(<GenericDialog {...props} />);
        const button = renderResult.getByRole('button', { name: /Cancel/i });
        fireEvent.click(button);

        expect(onCancelButtonClickMock).toHaveBeenCalledTimes(1);
    });
});
