// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import {
    CollapsibleComponent,
    CollapsibleComponentProps,
} from '../../../../../common/components/collapsible-component';

describe('CollapsibleComponentTest', () => {
    test('render expanded with content-class-name', () => {
        const props: CollapsibleComponentProps = {
            header: <div>Some header</div>,
            content: <div>Some content</div>,
            contentClassName: 'content-class-name',
        };
        const result = shallow(<CollapsibleComponent {...props} />);
        expect(result.getElement()).toMatchSnapshot();
    });

    test('render expanded without content-class-name', () => {
        const props: CollapsibleComponentProps = {
            header: <div>Some header</div>,
            content: <div>Some content</div>,
        };
        const result = shallow(<CollapsibleComponent {...props} />);
        expect(result.getElement()).toMatchSnapshot();
    });

    test('render with container-class-name', () => {
        const props: CollapsibleComponentProps = {
            header: <div>Some header</div>,
            content: <div>Some content</div>,
            containerClassName: 'a-container',
        };

        const result = shallow(<CollapsibleComponent {...props} />);
        expect(result.getElement()).toMatchSnapshot();
    });

    test('render without container-class-name', () => {
        const props: CollapsibleComponentProps = {
            header: <div>Some header</div>,
            content: <div>Some content</div>,
        };

        const result = shallow(<CollapsibleComponent {...props} />);
        expect(result.hasClass('collapsible-component')).toBe(true);
    });

    test('toggle from expanded to collapsed', () => {
        const props: CollapsibleComponentProps = {
            header: <div>Some header</div>,
            content: <div>Some content</div>,
        };
        const result = shallow(<CollapsibleComponent {...props} />);
        expect(result.getElement()).toMatchSnapshot('expanded');
        const button = result.find('CustomizedActionButton');
        button.simulate('click');
        expect(result.getElement()).toMatchSnapshot('collapsed');
    });
});
