// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import {
    DateFormatter,
    defaultDateFormatter,
    onRenderCustomProperties,
    onRenderTimestamp,
    TelemetryMessagesList,
    TelemetryMessagesListProps,
} from 'debug-tools/components/telemetry-viewer/telemetry-messages-list';
import { DebugToolsTelemetryMessage } from 'debug-tools/controllers/telemetry-listener';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, MockBehavior } from 'typemoq';

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

    let dateFormatterMock: IMock<DateFormatter>;
    let props: TelemetryMessagesListProps;

    beforeEach(() => {
        dateFormatterMock = Mock.ofInstance<DateFormatter>(defaultDateFormatter);

        props = {
            items: getItems(),
            dateFormatter: dateFormatterMock.object,
        };
    });

    it('renders and matches snapshot', () => {
        const wrapped = shallow(<TelemetryMessagesList {...props} />);

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

        describe('onRenderTimestamp (from the column onRender)', () => {
            const testSubject = onRenderTimestamp;

            it('matches snapshot', () => {
                dateFormatterMock = Mock.ofType<DateFormatter>(undefined, MockBehavior.Strict);
                dateFormatterMock
                    .setup(formatter => formatter(item.timestamp))
                    .returns(() => 'formatted-datetime');

                const wrapped = shallow(
                    <Wrapper renderer={() => testSubject(item, dateFormatterMock.object)} />,
                );

                expect(wrapped.getElement()).toMatchSnapshot();
            });
        });
    });
});
