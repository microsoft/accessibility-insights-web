// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScreenshotData } from 'common/types/store-data/unified-data-interface';
import { ScreenshotView } from 'electron/views/screenshot/screenshot-view';
import { ScreenshotViewModel } from 'electron/views/screenshot/screenshot-view-model';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('ScreenshotView', () => {
    describe('renders', () => {
        it('when passed a value for screenshotData', () => {
            const viewModel: ScreenshotViewModel = {
                screenshotData: { base64PngData: 'testScreenshotPath' },
                highlightBoxRectangles: [],
                deviceName: null,
            };
            const wrapper = shallow(<ScreenshotView viewModel={viewModel} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });

        const emptyScreenshotDataCases: ScreenshotData[] = [null, undefined, {} as ScreenshotData];
        it.each(emptyScreenshotDataCases)('when passed empty screenshotData %p', (screenshotDataCase: ScreenshotData) => {
            const viewModel: ScreenshotViewModel = {
                screenshotData: screenshotDataCase,
                highlightBoxRectangles: [],
                deviceName: null,
            };
            const wrapper = shallow(<ScreenshotView viewModel={viewModel} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });
});
