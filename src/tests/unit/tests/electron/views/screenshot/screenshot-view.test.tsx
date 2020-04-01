// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScreenshotData } from 'common/types/store-data/unified-data-interface';
import { ScreenshotView } from 'electron/views/screenshot/screenshot-view';
import { ScreenshotViewModel } from 'electron/views/screenshot/screenshot-view-model';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('ScreenshotView', () => {
    describe('render', () => {
        it('matches snapshot when screenshot data is available', () => {
            const viewModel: ScreenshotViewModel = {
                screenshotData: { base64PngData: 'test-base-64-png-data' },
                highlightBoxViewModels: [],
                deviceName: 'My Cool Android Device',
            };
            const wrapper = shallow(<ScreenshotView viewModel={viewModel} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });

        const emptyScreenshotDataCases: ScreenshotData[] = [null, undefined, {} as ScreenshotData];
        it.each(emptyScreenshotDataCases)(
            'matches snapshot when passed empty screenshotData %p',
            (screenshotDataCase: ScreenshotData) => {
                const viewModel: ScreenshotViewModel = {
                    screenshotData: screenshotDataCase,
                    highlightBoxViewModels: [],
                    deviceName: null,
                };
                const wrapper = shallow(<ScreenshotView viewModel={viewModel} />);

                expect(wrapper.getElement()).toMatchSnapshot();
            },
        );
    });
});
