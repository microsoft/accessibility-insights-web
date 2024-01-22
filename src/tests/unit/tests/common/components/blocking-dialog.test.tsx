// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Dialog, IDialogProps } from '@fluentui/react';
import { render } from '@testing-library/react';
import * as React from 'react';

import { BlockingDialog } from '../../../../../common/components/blocking-dialog';
import {
    getMockComponentClassPropsForCall,
    mockReactComponents,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('@fluentui/react');
describe('BlockingDialog', () => {
    mockReactComponents([Dialog]);
    it('sets the properties necessary to emulate being blocking', () => {
        render(<BlockingDialog />);
        const dialogProps = getMockComponentClassPropsForCall(Dialog);

        expect(dialogProps.dialogContentProps.showCloseButton).toBe(false);
        expect(dialogProps.modalProps.onDismiss).toBeUndefined();
        expect(dialogProps.onDismiss).toBeUndefined();
        expect(dialogProps.modalProps.isBlocking).toBe(false);
    });

    it('passes through other props to the underlying dialog as-is', () => {
        const propsThatBlockingDialogShouldntModify: IDialogProps = {
            title: 'test title',
            dialogContentProps: {
                subTextId: 'test subTextId',
            },
            modalProps: {
                containerClassName: 'test containerClassName',
            },
        };

        render(<BlockingDialog {...propsThatBlockingDialogShouldntModify} />);
        const dialogProps = getMockComponentClassPropsForCall(Dialog);

        expect(dialogProps).toMatchObject(propsThatBlockingDialogShouldntModify);
    });
});
