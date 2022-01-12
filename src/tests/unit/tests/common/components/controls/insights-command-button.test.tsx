// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { shallow } from 'enzyme';
import { IIconProps } from '@fluentui/react';
import * as React from 'react';

describe('InsightsCommandButton', () => {
    it('renders per snapshot with props passed through', () => {
        const testSubject = shallow(<InsightsCommandButton text={'test-text'} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });

    it('renders per snapshot with extra className combined with its own', () => {
        const testSubject = shallow(<InsightsCommandButton className={'test-extra-class-name'} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });

    it('renders per snapshot with iconProps passed through', () => {
        const iconProps = { testProperty: 'test-value' } as IIconProps;
        const testSubject = shallow(<InsightsCommandButton iconProps={iconProps} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });

    it('renders per snapshot with extra icon className combined with its own', () => {
        const iconProps = {
            className: 'icon-class-name',
        } as IIconProps;
        const testSubject = shallow(<InsightsCommandButton iconProps={iconProps} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
