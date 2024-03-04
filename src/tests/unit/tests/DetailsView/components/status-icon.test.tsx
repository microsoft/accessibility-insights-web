// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Icon } from '@fluentui/react';
import { render } from '@testing-library/react';
import * as React from 'react';
import { ManualTestStatus } from '../../../../../common/types/store-data/manual-test-status';
import { StatusIcon } from '../../../../../DetailsView/components/status-icon';
import { mockReactComponents } from '../../../mock-helpers/mock-module-helpers';
jest.mock('@fluentui/react');

describe('StatusIcon', () => {
    mockReactComponents([(Icon as any).type]);
    test('render for PASS', () => {
        const renderResult = render(<StatusIcon status={ManualTestStatus.PASS} level="test" />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    test('render for PASS with extra class name', () => {
        const renderResult = render(
            <StatusIcon status={ManualTestStatus.PASS} className={'test'} level="test" />,
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    test('render for FAIL', () => {
        const renderResult = render(
            <StatusIcon status={ManualTestStatus.FAIL} level="requirement" />,
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    test('render for UNKNOWN', () => {
        const renderResult = render(
            <StatusIcon status={ManualTestStatus.UNKNOWN} level="requirement" />,
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    test('render for default', () => {
        const status: ManualTestStatus = -1 as ManualTestStatus;
        const renderResult = render(<StatusIcon status={status} level="requirement" />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
