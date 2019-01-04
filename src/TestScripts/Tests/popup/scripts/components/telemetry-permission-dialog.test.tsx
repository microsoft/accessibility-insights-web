// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Enzyme from 'enzyme';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import * as React from 'react';

import { FeatureFlags } from '../../../../../common/feature-flags';
import { UserConfigMessageCreator } from '../../../../../common/message-creators/user-config-message-creator';
import { FeatureFlagStoreData } from '../../../../../common/types/store-data/feature-flag-store-data';
import {
    TelemetryPermissionDialog,
    TelemetryPermissionDialogProps,
} from '../../../../../popup/scripts/components/telemetry-permission-dialog';


describe('TelemetryPermissionDialogTest', () => {
    let userConfigMessageCreatorStub: UserConfigMessageCreator;
    let setTelemetryStateMock: () => null;

    beforeEach(() => {
        userConfigMessageCreatorStub = {} as UserConfigMessageCreator;
        setTelemetryStateMock = jest.fn();
        userConfigMessageCreatorStub.setTelemetryState = setTelemetryStateMock;
    });

    test('render null if not first time', () => {
        const featureFlagStoreData = {
        } as FeatureFlagStoreData;
        const props: TelemetryPermissionDialogProps = {
            deps: {
                userConfigMessageCreator: userConfigMessageCreatorStub,
            },
            featureFlagStoreData: featureFlagStoreData,
            isFirstTime: false,
        };

        const component = new TelemetryPermissionDialog(props);
        expect(component.render()).toBe(null);
    });

    test('render dialog', () => {
        const props: TelemetryPermissionDialogProps = {
            deps: {
                userConfigMessageCreator: userConfigMessageCreatorStub,
            },
            isFirstTime: true,
        };

        const wrapper = Enzyme.shallow(<TelemetryPermissionDialog {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
        expect(wrapper.state()).toMatchObject({ isEnableTelemetryChecked: true });
    });

    test('toggle check box', () => {
        const props: TelemetryPermissionDialogProps = {
            deps: {
                userConfigMessageCreator: userConfigMessageCreatorStub,
            },
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
            },
            isFirstTime: true,
        };

        const wrapper = Enzyme.shallow(<TelemetryPermissionDialog {...props} />);
        const button = wrapper.find(PrimaryButton);
        button.simulate('click');
        expect(setTelemetryStateMock).toBeCalled();
    });
});
