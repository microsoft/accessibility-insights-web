// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Screenshot, ScreenshotProps } from 'electron/views/screenshot/screenshot';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('Screenshot', () => {
    it('renders', () => {
        const props: ScreenshotProps = {
            encodedImage: 'test-image-string',
        };
        const wrapper = shallow(<Screenshot {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
