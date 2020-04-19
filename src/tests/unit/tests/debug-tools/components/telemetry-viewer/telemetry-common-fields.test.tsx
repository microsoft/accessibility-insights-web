// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    TelemetryCommonFields,
    TelemetryCommonFieldsProps,
} from 'debug-tools/components/telemetry-viewer/telemetry-common-fields';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('TelemetryCommonFields', () => {
    const props: TelemetryCommonFieldsProps = {
        applicationBuild: 'test-app-build',
        applicationName: 'test-app-name',
        applicationVersion: 'test-app-version',
        installationId: 'test-installation-id',
    };

    it('renders and match snapshot', () => {
        const wrapped = shallow(<TelemetryCommonFields {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
