// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScreenshotView } from 'electron/views/screenshot/screenshot-view';
import { ScreenshotViewModel } from 'electron/views/screenshot/screenshot-view-model';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('ScreenshotView', () => {
    it('renders', () => {
        const viewModel: ScreenshotViewModel = {
            screenshotData: null,
            highlightBoxRectangles: [],
            deviceName: null,
        };
        const wrapper = shallow(<ScreenshotView viewModel={viewModel} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
