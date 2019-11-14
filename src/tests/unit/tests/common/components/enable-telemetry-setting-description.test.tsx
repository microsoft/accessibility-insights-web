// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    EnableTelemetrySettingDescription,
    EnableTelemetrySettingDescriptionDeps,
} from '../../../../../common/components/enable-telemetry-setting-description';
import { NewTabLink } from '../../../../../common/components/new-tab-link';
import { PrivacyStatementText } from '../../../../../common/components/privacy-statement-text';
import { TelemetryNotice } from '../../../../../common/components/telemetry-notice';

describe('EnableTelemetrySettingDescription', () => {
    it('renders', () => {
        const deps: EnableTelemetrySettingDescriptionDeps = {
            LinkComponent: NewTabLink,
        };

        const wrapper = shallow(
            <EnableTelemetrySettingDescription deps={deps} />,
        );
        const telemetryNotice = wrapper.find(TelemetryNotice);
        const privacyStatementText = wrapper.find(PrivacyStatementText);

        expect(wrapper.getElement()).toMatchSnapshot();
        expect(telemetryNotice.prop('deps').LinkComponent).toBe(
            deps.LinkComponent,
        );
        expect(privacyStatementText.prop('deps').LinkComponent).toBe(
            deps.LinkComponent,
        );
    });
});
