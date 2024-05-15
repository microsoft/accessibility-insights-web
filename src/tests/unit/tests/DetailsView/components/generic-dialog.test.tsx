// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Dialog, DialogFooter, PrimaryButton } from '@fluentui/react';
import { render } from '@testing-library/react';
import * as React from 'react';

import {
    GenericDialog,
    GenericDialogProps,
} from '../../../../../DetailsView/components/generic-dialog';
import {
    getMockComponentClassPropsForCall,
    mockReactComponents,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('@fluentui/react');

describe('GenericDialogTest', () => {
    mockReactComponents([Dialog, DialogFooter]);
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

        render(<GenericDialog {...props} />);
        getMockComponentClassPropsForCall(Dialog).onDismiss();

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

        render(<GenericDialog {...props} />);

        getMockComponentClassPropsForCall(PrimaryButton).onClick();

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

        render(<GenericDialog {...props} />);
        getMockComponentClassPropsForCall(Dialog).onDismiss();

        expect(onCancelButtonClickMock).toHaveBeenCalledTimes(1);
    });
});
