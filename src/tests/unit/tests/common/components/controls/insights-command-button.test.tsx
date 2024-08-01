// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Button, tokens } from '@fluentui/react-components';
import { FolderOpenRegular } from '@fluentui/react-icons';

import { render } from '@testing-library/react';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import * as React from 'react';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../../mock-helpers/mock-module-helpers';
//import { InsightsCommandButtonStyle } from 'common/components/controls/insights-command-button-style';

//jest.mock('common/components/controls/insights-command-button-style');
// jest.mock('@fluentui/react-components', (...rest) => {
//     console.log('rest-->', rest)
//     return {
//         makeStyles: jest.fn(),
//         mergeClasses: jest.fn(),
//         ...rest
//     }
// });

jest.mock('common/components/controls/insights-command-button-style', () => {
    return {
        useInsightsCommandButtonStyle: jest.fn(),
    };
});

jest.mock('@fluentui/react-components');

describe('InsightsCommandButton', () => {
    mockReactComponents([Button]);
    const props = {
        insightsCommandButtonIconProps: {
            className: 'startOverMenuItemIcon',
        },
        className: '',
    };
    it('renders per snapshot with props passed through', () => {
        const renderResult = render(
            <InsightsCommandButton {...props}>test-text</InsightsCommandButton>,
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([Button]);
    });

    it('renders per snapshot with extra className combined with its own', () => {
        const renderResult = render(<InsightsCommandButton {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([Button]);
    });

    it('renders per snapshot with iconProps passed through', () => {
        const renderResult = render(
            <InsightsCommandButton insightsCommandButtonIconProps={{ icon: <FolderOpenRegular /> }}>
                Load assessment
            </InsightsCommandButton>,
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([Button]);
    });

    it('renders per snapshot with extra icon className combined with its own', () => {
        const renderResult = render(
            <InsightsCommandButton
                insightsCommandButtonIconProps={{
                    icon: <FolderOpenRegular className="icon-class-name" />,
                }}
            >
                Load assessment
            </InsightsCommandButton>,
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([Button]);
    });
});
