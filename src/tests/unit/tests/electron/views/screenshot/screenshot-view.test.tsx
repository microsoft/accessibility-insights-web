// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScreenshotView } from 'electron/views/screenshot/screenshot-view';
import { ScreenshotViewModel } from 'electron/views/screenshot/screenshot-view-model';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('ScreenshotView', () => {
    describe('renders', () => {
        it('when passed a value for screenshotData', () => {
            const viewModel: ScreenshotViewModel = {
                screenshotData: { base64PngData: 'test-base-64-png-data' },
                highlightBoxRectangles: [],
                deviceName: null,
            };
            const wrapper = shallow(<ScreenshotView viewModel={viewModel} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });
});
