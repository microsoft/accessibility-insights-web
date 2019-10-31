// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScreenshotView, ScreenshotViewProps } from 'electron/views/screenshot/screenshot-view';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('ScreenshotView', () => {
    it('renders', () => {
        const props: ScreenshotViewProps = {};
        const wrapper = shallow(<ScreenshotView {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
