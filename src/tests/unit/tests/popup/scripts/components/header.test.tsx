// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import Header, { IHeaderProps } from '../../../../../../popup/scripts/components/header';

describe('HeaderTest', () => {
    test('render', () => {
        const props: IHeaderProps = {
            title: 'title',
            subtitle: 'sub-title',
        };

        const wrapper = shallow(<Header {...props} />);

        expect(wrapper.debug()).toMatchSnapshot();
    });

    test('render with rowExtraClassName prop', () => {
        const props: IHeaderProps = {
            title: null,
            subtitle: null,
            rowExtraClassName: 'extra-class',
        };

        const wrapper = shallow(<Header {...props} />);

        expect(wrapper.debug()).toMatchSnapshot();
    });

    test('render with extraContent prop', () => {
        const extraContent: JSX.Element = (<div>my content</div>);

        const props: IHeaderProps = {
            title: null,
            subtitle: null,
            extraContent: extraContent,
        };

        const wrapper = shallow(<Header {...props} />);

        expect(wrapper.debug()).toMatchSnapshot();
    });
});
