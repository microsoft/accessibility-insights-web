// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScreenshotData } from 'common/types/store-data/unified-data-interface';
import { ScreenshotView } from 'electron/views/screenshot/screenshot-view';
import { ScreenshotViewModel } from 'electron/views/screenshot/screenshot-view-model';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('ScreenshotView', () => {
    describe('renders', () => {
        it('when passed a null value for screenshotData', () => {
            const viewModel: ScreenshotViewModel = {
                screenshotData: null,
                highlightBoxRectangles: [],
                deviceName: null,
            };
            const wrapper = shallow(<ScreenshotView viewModel={viewModel} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('when passed an empty value for screenshotData', () => {
            const viewModel: ScreenshotViewModel = {
                screenshotData: {} as ScreenshotData,
                highlightBoxRectangles: [],
                deviceName: null,
            };
            const wrapper = shallow(<ScreenshotView viewModel={viewModel} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });
        it('when passed an undefined value for screenshotData', () => {
            const viewModel: ScreenshotViewModel = {
                screenshotData: undefined,
                highlightBoxRectangles: [],
                deviceName: null,
            };
            const wrapper = shallow(<ScreenshotView viewModel={viewModel} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });
});
