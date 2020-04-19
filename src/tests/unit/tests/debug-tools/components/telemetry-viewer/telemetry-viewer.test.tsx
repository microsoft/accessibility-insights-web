// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    TelemetryViewer,
    TelemetryViewerDeps,
    TelemetryViewerProps,
} from 'debug-tools/components/telemetry-viewer/telemetry-viewer';
import { TelemetryListener } from 'debug-tools/controllers/telemetry-listener';
import { shallow } from 'enzyme';
import { isFunction } from 'lodash';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';

describe('TelemetryViewer', () => {
    let telemetryListenerMock: IMock<TelemetryListener>;

    let deps: TelemetryViewerDeps;
    let props: TelemetryViewerProps;

    beforeEach(() => {
        telemetryListenerMock = Mock.ofType<TelemetryListener>();

        deps = {
            telemetryListener: telemetryListenerMock.object,
        };

        props = { deps };
    });

    it('add listner for telemetry messages', () => {
        shallow(<TelemetryViewer {...props} />);

        telemetryListenerMock.verify(
            listener => listener.addListener(It.is(isFunction)),
            Times.once(),
        );
    });

    describe('renders', () => {
        it('when there are no telemetry messages', () => {
            const wrapped = shallow(<TelemetryViewer {...props} />);

            expect(wrapped.getElement()).toMatchSnapshot();
        });

        it('when there is at least one telemetry message', () => {
            let callback: Function;

            telemetryListenerMock
                .setup(listener => listener.addListener(It.is(isFunction)))
                .callback(l => (callback = l));

            const wrapped = shallow(<TelemetryViewer {...props} />);

            callback({
                key: 'value',
                applicationBuild: 'test-application-build',
                applicationName: 'test-application-name',
                applicationVersion: 'test-application-version',
                installationId: 'test-installation-id',
            });

            expect(wrapped.getElement()).toMatchSnapshot();
        });
    });
});
