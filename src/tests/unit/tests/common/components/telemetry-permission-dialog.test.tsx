// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UserConfigurationActionCreator } from 'background/global-action-creators/types/user-configuration-action-creator';
import { NewTabLink } from 'common/components/new-tab-link';
import { PrivacyStatementPopupText } from 'common/components/privacy-statement-text';
import { TelemetryNotice } from 'common/components/telemetry-notice';
import {
    TelemetryPermissionDialog,
    TelemetryPermissionDialogDeps,
    TelemetryPermissionDialogProps,
} from 'common/components/telemetry-permission-dialog';
import * as Enzyme from 'enzyme';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import * as React from 'react';

describe('TelemetryPermissionDialogTest', () => {
    let userConfigMessageCreatorStub: UserConfigurationActionCreator;
    let setTelemetryStateMock: () => null;

    beforeEach(() => {
        userConfigMessageCreatorStub = {} as UserConfigurationActionCreator;
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
        const props: TelemetryPermissionDialogProps = {
            deps: {
                LinkComponent: NewTabLink,
            } as TelemetryPermissionDialogDeps,
            isFirstTime: true,
        };

        const wrapper = Enzyme.shallow(<TelemetryPermissionDialog {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
        expect(wrapper.state()).toMatchObject({ isEnableTelemetryChecked: true });

        const telemetryNotice = wrapper.find(TelemetryNotice);
        expect(telemetryNotice.prop('deps').LinkComponent).toBe(props.deps.LinkComponent);

        const privacyStatementPopupText = wrapper.find(PrivacyStatementPopupText);
        expect(privacyStatementPopupText.prop('deps').LinkComponent).toBe(props.deps.LinkComponent);
    });

    test('toggle check box', () => {
        const props: TelemetryPermissionDialogProps = {
            deps: {} as TelemetryPermissionDialogDeps,
            isFirstTime: true,
        };

        const wrapper = Enzyme.shallow(<TelemetryPermissionDialog {...props} />);
        const checkBox = wrapper.find(Checkbox);
        expect(wrapper.state()).toMatchObject({ isEnableTelemetryChecked: true });
        checkBox.props().onChange(null, false);
        expect(wrapper.state()).toMatchObject({ isEnableTelemetryChecked: false });
        checkBox.props().onChange(null, true);
        expect(wrapper.state()).toMatchObject({ isEnableTelemetryChecked: true });
    });

    test('button click', () => {
        const props: TelemetryPermissionDialogProps = {
            deps: {
                userConfigMessageCreator: userConfigMessageCreatorStub,
            } as TelemetryPermissionDialogDeps,
            isFirstTime: true,
        };

        const wrapper = Enzyme.shallow(<TelemetryPermissionDialog {...props} />);
        const button = wrapper.find(PrimaryButton);
        button.simulate('click');
        expect(setTelemetryStateMock).toBeCalled();
    });
});
