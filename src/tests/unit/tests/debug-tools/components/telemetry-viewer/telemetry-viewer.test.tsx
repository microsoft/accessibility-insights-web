// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { act, render } from '@testing-library/react';
import {
    TelemetryViewer,
    TelemetryViewerDeps,
    TelemetryViewerProps,
} from 'debug-tools/components/telemetry-viewer/telemetry-viewer';
import { TelemetryListener } from 'debug-tools/controllers/telemetry-listener';
import { isFunction } from 'lodash';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';
import { TelemetryCommonFields } from '../../../../../../debug-tools/components/telemetry-viewer/telemetry-common-fields';
import { TelemetryMessagesList } from '../../../../../../debug-tools/components/telemetry-viewer/telemetry-messages-list';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../debug-tools/components/telemetry-viewer/telemetry-messages-list');
jest.mock('../../../../../../debug-tools/components/telemetry-viewer/telemetry-common-fields');
describe('TelemetryViewer', () => {
    mockReactComponents([TelemetryMessagesList, TelemetryCommonFields]);
    let telemetryListenerMock: IMock<TelemetryListener>;

    let deps: TelemetryViewerDeps;
    let props: TelemetryViewerProps;

    beforeEach(() => {
        telemetryListenerMock = Mock.ofType(TelemetryListener);

        deps = {
            telemetryListener: telemetryListenerMock.object,
        } as TelemetryViewerDeps;

        props = { deps };
    });

    it('adds listener for telemetry messages on mount', () => {
        render(<TelemetryViewer {...props} />);

        telemetryListenerMock.verify(
            listener => listener.addListener(It.is(isFunction)),
            Times.once(),
        );
    });

    it('removes listener for telemetry messages on unmount', () => {
        const renderResult = render(<TelemetryViewer {...props} />);

        renderResult.unmount();

        telemetryListenerMock.verify(
            listener => listener.removeListener(It.is(isFunction)),
            Times.once(),
        );
    });

    describe('renders', () => {
        it('when there are no telemetry messages', () => {
            const renderResult = render(<TelemetryViewer {...props} />);

            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        it('when there is at least one telemetry message', () => {
            let callback: Function;

            telemetryListenerMock
                .setup(listener => listener.addListener(It.is(isFunction)))
                .callback(l => (callback = l));

            const renderResult = render(<TelemetryViewer {...props} />);
            act(() => {
                callback({
                    key: 'value',
                    applicationBuild: 'test-application-build',
                    applicationName: 'test-application-name',
                    applicationVersion: 'test-application-version',
                    installationId: 'test-installation-id',
                });
            });

            expect(renderResult.asFragment()).toMatchSnapshot();
            expectMockedComponentPropsToMatchSnapshots([TelemetryMessagesList]);
        });
    });
});
