// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IIconProps } from '@fluentui/react';
import { render } from '@testing-library/react';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import * as React from 'react';

describe('InsightsCommandButton', () => {
    it('renders per snapshot with props passed through', () => {
        const renderResult = render(<InsightsCommandButton text={'test-text'} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders per snapshot with extra className combined with its own', () => {
        const renderResult = render(<InsightsCommandButton className={'test-extra-class-name'} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders per snapshot with iconProps passed through', () => {
        const iconProps = { testProperty: 'test-value' } as IIconProps;
        const renderResult = render(<InsightsCommandButton iconProps={iconProps} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders per snapshot with extra icon className combined with its own', () => {
        const iconProps = {
            className: 'icon-class-name',
        } as IIconProps;
        const renderResult = render(<InsightsCommandButton iconProps={iconProps} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
