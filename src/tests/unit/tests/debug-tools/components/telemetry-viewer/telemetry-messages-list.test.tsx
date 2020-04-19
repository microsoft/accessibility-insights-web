// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import {
    onRenderCustomProperties,
    TelemetryMessagesList,
    onRenderTimestamp,
} from 'debug-tools/components/telemetry-viewer/telemetry-messages-list';
import { DebugToolsTelemetryMessage } from 'debug-tools/controllers/telemetry-listener';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('TelemetryMessagesList', () => {
    const getItems: () => DebugToolsTelemetryMessage[] = () => [
        {
            applicationBuild: 'test-app-build',
            applicationName: 'test-app-name',
            applicationVersion: 'test-app-version',
            customProperties: {
                key1: 'value1',
                key2: 'value2',
            },
            installationId: 'test-installation-id',
            name: 'test-name',
            source: 'test-source',
            timestamp: 1,
            triggeredBy: 'test-triggered-by',
        },
    ];

    it('renders and matches snapshot', () => {
        const wrapped = shallow(<TelemetryMessagesList items={getItems()} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });

    describe('custom renderers', () => {
        type Renderer = () => JSX.Element;
        type WrapperProps = { renderer: Renderer };
        const Wrapper = NamedFC<WrapperProps>('Wrapper', ({ renderer }) => <>{renderer()}</>);

        let item: DebugToolsTelemetryMessage;

        beforeEach(() => {
            item = getItems().pop();
        });

        describe('onRenderTimestamp', () => {
            const testSubject = onRenderTimestamp;

            it('matches snapshot', () => {
                const wrapped = shallow(<Wrapper renderer={() => testSubject(item)} />);

                expect(wrapped.getElement()).toMatchSnapshot();
            });
        });

        describe('onRenderCustomProperties', () => {
            const testSubject = onRenderCustomProperties;

            it('when there is not custom properties', () => {
                delete item.customProperties;

                const wrapped = shallow(
                    <Wrapper renderer={() => testSubject('customProperties', item)} />,
                );

                expect(wrapped.getElement()).toMatchSnapshot();
            });

            it('when custom properties is present', () => {
                const wrapped = shallow(
                    <Wrapper renderer={() => testSubject('customProperties', item)} />,
                );

                expect(wrapped.getElement()).toMatchSnapshot();
            });
        });
    });
});
