// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsList } from '@fluentui/react';
import { render } from '@testing-library/react';
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
import * as React from 'react';
import { IMock, Mock } from 'typemoq';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../../mock-helpers/mock-module-helpers';

jest.mock('@fluentui/react');
describe('TelemetryMessagesList', () => {
    mockReactComponents([DetailsList]);
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
            deps: {
                dateFormatter: dateFormatterMock.object,
            },
        };
    });

    it('renders and matches snapshot', () => {
        const renderResult = render(<TelemetryMessagesList {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([DetailsList]);
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

                const renderResult = render(
                    <Wrapper renderer={() => testSubject('customProperties', item)} />,
                );

                expect(renderResult.asFragment()).toMatchSnapshot();
            });

            it('when custom properties is present', () => {
                const renderResult = render(
                    <Wrapper renderer={() => testSubject('customProperties', item)} />,
                );

                expect(renderResult.asFragment()).toMatchSnapshot();
            });
        });

        describe('onRenderTimestamp (from the column onRender)', () => {
            const testSubject = onRenderTimestamp;

            it('matches snapshot', () => {
                dateFormatterMock = Mock.ofType(undefined);
                dateFormatterMock
                    .setup(formatter => formatter(item.timestamp))
                    .returns(() => 'formatted-datetime');

                const renderResult = render(
                    <Wrapper renderer={() => testSubject(item, dateFormatterMock.object)} />,
                );

                expect(renderResult.asFragment()).toMatchSnapshot();
            });
        });
    });
});
