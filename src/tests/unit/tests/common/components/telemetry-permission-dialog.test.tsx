// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { fireEvent, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import * as React from 'react';
import {
    getMockComponentClassPropsForCall,
    mockReactComponents,
    useOriginalReactElements,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { NewTabLink } from '../../../../../common/components/new-tab-link';
import { PrivacyStatementPopupText } from '../../../../../common/components/privacy-statement-text';
import { TelemetryNotice } from '../../../../../common/components/telemetry-notice';
import {
    SetTelemetryStateMessageCreator,
    TelemetryPermissionDialog,
    TelemetryPermissionDialogDeps,
    TelemetryPermissionDialogProps,
} from '../../../../../common/components/telemetry-permission-dialog';
import { UserConfigMessageCreator } from '../../../../../common/message-creators/user-config-message-creator';
import { Checkbox, Dialog, DialogFooter, PrimaryButton } from '@fluentui/react';
jest.mock('../../../../../common/components/privacy-statement-text');
jest.mock('../../../../../common/components/telemetry-notice');
jest.mock('@fluentui/react');

describe('TelemetryPermissionDialogTest', () => {
    mockReactComponents([
        TelemetryNotice,
        PrivacyStatementPopupText,
        Dialog,
        Checkbox,
        DialogFooter,
        PrimaryButton,
    ]);
    let userConfigMessageCreatorStub: SetTelemetryStateMessageCreator;
    let setTelemetryStateMock: () => null;

    beforeEach(() => {
        userConfigMessageCreatorStub = {} as UserConfigMessageCreator;
        setTelemetryStateMock = jest.fn();
        userConfigMessageCreatorStub.setTelemetryState = setTelemetryStateMock;
    });

    test('render null if not first time', () => {
        const props: TelemetryPermissionDialogProps = {
            isFirstTime: false,
        } as TelemetryPermissionDialogProps;

        const component = new TelemetryPermissionDialog(props);
        expect(component.render()).toBe(null);
    });

    test('render dialog', () => {
        useOriginalReactElements('@fluentui/react', ['Dialog', 'Checkbox']);
        const props: TelemetryPermissionDialogProps = {
            deps: {
                LinkComponent: NewTabLink,
            } as TelemetryPermissionDialogDeps,
            isFirstTime: true,
        };

        const { baseElement, getByRole } = render(<TelemetryPermissionDialog {...props} />);
        expect(baseElement).toMatchSnapshot();
        const checkBox = getByRole('checkbox') as HTMLInputElement;
        expect(checkBox.checked).toEqual(true);

        const telemetryNotice = getMockComponentClassPropsForCall(TelemetryNotice);
        expect(telemetryNotice.deps.LinkComponent).toBe(props.deps.LinkComponent);

        const privacyStatementPopupText =
            getMockComponentClassPropsForCall(PrivacyStatementPopupText);
        expect(privacyStatementPopupText.deps.LinkComponent).toBe(props.deps.LinkComponent);
    });

    test('toggle check box', () => {
        useOriginalReactElements('@fluentui/react', ['Dialog', 'Checkbox']);
        const props: TelemetryPermissionDialogProps = {
            deps: {} as TelemetryPermissionDialogDeps,
            isFirstTime: true,
        };
        const renderResult = render(<TelemetryPermissionDialog {...props} />);
        const checkBox = renderResult.getByRole('checkbox') as HTMLInputElement;
        expect(checkBox.checked).toEqual(true);
        fireEvent.click(checkBox);
        expect(checkBox.checked).toEqual(false);
        fireEvent.click(checkBox);
        expect(checkBox.checked).toEqual(true);
    });

    test('button click', async () => {
        useOriginalReactElements('@fluentui/react', ['Dialog', 'DialogFooter', 'PrimaryButton']);
        const props: TelemetryPermissionDialogProps = {
            deps: {
                userConfigMessageCreator: userConfigMessageCreatorStub,
            } as TelemetryPermissionDialogDeps,
            isFirstTime: true,
        };

        const renderResult = render(<TelemetryPermissionDialog {...props} />);
        await userEvent.click(renderResult.getByRole('button'));
        expect(setTelemetryStateMock).toHaveBeenCalledTimes(1);
    });
});
