// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScreenshotComponent, ScreenshotComponentProps } from 'electron/views/screenshot/screenshot-component';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('ScreenshotComponent', () => {
    it('renders', () => {
        const props: ScreenshotComponentProps = {
            image: 'test-image-string',
            alt: 'test-alt-caption',
        };
        const wrapper = shallow(<ScreenshotComponent {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
