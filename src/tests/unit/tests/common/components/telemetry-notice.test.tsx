// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { NewTabLink } from '../../../../../common/components/new-tab-link';
import {
    TelemetryNotice,
    TelemetryNoticeDeps,
} from '../../../../../common/components/telemetry-notice';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../mock-helpers/mock-module-helpers';
jest.mock('../../../../../common/components/new-tab-link');

describe('TelemetryNotice', () => {
    mockReactComponents([NewTabLink]);
    it('renders', () => {
        const deps: TelemetryNoticeDeps = {
            LinkComponent: NewTabLink,
        };

        const renderResult = render(<TelemetryNotice deps={deps} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([NewTabLink]);
    });
});
