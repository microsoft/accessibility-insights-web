// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { CodeExample } from 'views/content/markup/code-example';

describe('<CodeExample>', () => {
    it('renders with title', () => {
        const wrapper = shallow(<CodeExample title="title">code</CodeExample>);
        expect(wrapper.find('.code-example-title').getElement()).toEqual(
            <div className="code-example-title">
                <h4>title</h4>
            </div>,
        );
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders with no title', () => {
        const wrapper = shallow(<CodeExample>code</CodeExample>);
        expect(wrapper.find('.code-example-title').exists()).toEqual(false);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders with no highlighted region', () => {
        const wrapper = shallow(<CodeExample>No highlight</CodeExample>);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders with one highlighted region', () => {
        const wrapper = shallow(<CodeExample>One [single] highlight</CodeExample>);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders with empty highlighted region', () => {
        const wrapper = shallow(<CodeExample>Empty [] highlight</CodeExample>);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders with unterminated highlighted region', () => {
        const wrapper = shallow(<CodeExample>One [unterminated highlight</CodeExample>);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders with many highlighted regions', () => {
        const wrapper = shallow(
            <CodeExample>With [quite] a [number] of [highlights].</CodeExample>,
        );
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders with a single line break', () => {
        const wrapper = shallow(<CodeExample>{`Line 1\nLine 2`}</CodeExample>);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders with a line breaks and a highlighted line', () => {
        const wrapper = shallow(<CodeExample>{`Line 1\n[Line 2]\nLine 3`}</CodeExample>);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders with a highlight that spans multiple lines', () => {
        const wrapper = shallow(<CodeExample>{`Line 1\n[Line 2\nLine 3]\nLine 4`}</CodeExample>);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders with a highlight that breaks in the middle of multiple lines', () => {
        const wrapper = shallow(
            <CodeExample>{`Line 1\nLine 2 [HIGHLIGHT\nHERE]Line 3\nLine 4`}</CodeExample>,
        );
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('br has the correct key', () => {
        const wrapper = shallow(<CodeExample>{`Line 1\nLine 2`}</CodeExample>);
        expect(wrapper.find('br').at(0).key()).toEqual(`line-breaker-1`);
    });
});
