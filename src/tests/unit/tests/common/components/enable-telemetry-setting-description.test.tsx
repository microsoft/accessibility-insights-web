// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import {
    EnableTelemetrySettingDescription,
    EnableTelemetrySettingDescriptionDeps,
} from '../../../../../common/components/enable-telemetry-setting-description';
import { NewTabLink } from '../../../../../common/components/new-tab-link';
import { PrivacyStatementText } from '../../../../../common/components/privacy-statement-text';
import { TelemetryNotice } from '../../../../../common/components/telemetry-notice';
import {
    expectMockedComponentPropsToMatchSnapshots,
    getMockComponentClassPropsForCall,
    mockReactComponents,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../common/components/telemetry-notice');
jest.mock('../../../../../common/components/privacy-statement-text');
describe('EnableTelemetrySettingDescription', () => {
    mockReactComponents([TelemetryNotice, PrivacyStatementText]);
    it('renders', () => {
        const deps: EnableTelemetrySettingDescriptionDeps = {
            LinkComponent: NewTabLink,
        };

        const renderResult = render(<EnableTelemetrySettingDescription deps={deps} />);
        const telemetryNotice = getMockComponentClassPropsForCall(TelemetryNotice);
        const privacyStatementText = getMockComponentClassPropsForCall(PrivacyStatementText);

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([TelemetryNotice, PrivacyStatementText]);
        expect(telemetryNotice.deps.LinkComponent).toBe(deps.LinkComponent);
        expect(privacyStatementText.deps.LinkComponent).toBe(deps.LinkComponent);
    });
});
