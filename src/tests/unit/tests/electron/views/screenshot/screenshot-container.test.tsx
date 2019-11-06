// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScreenshotData } from 'common/types/store-data/unified-data-interface';
import { BoundingRectangle } from 'electron/platform/android/scan-results';
import { ScreenshotContainer, ScreenshotContainerProps } from 'electron/views/screenshot/screenshot-container';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('ScreenshotContainer', () => {
    const basicScreenshotData: ScreenshotData = { base64PngData: 'test-base-64-png-data' };

    describe('screenshot', () => {
        it('renders when passed a value for screenshotData', () => {
            const wrapper = shallow(<ScreenshotContainer screenshotData={basicScreenshotData} highlightBoxRectangles={[]} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });

        const emptyScreenshotDataCases: ScreenshotData[] = [null, undefined, {} as ScreenshotData];

        it.each(emptyScreenshotDataCases)(
            'renders screenshot unavailable string when passed empty screenshotData %p',
            (screenshotDataCase: ScreenshotData) => {
                const wrapper = shallow(<ScreenshotContainer screenshotData={screenshotDataCase} highlightBoxRectangles={[]} />);

                expect(wrapper.getElement()).toMatchSnapshot();
            },
        );
    });

    describe('highlight boxes', () => {
        it('do not render when highlightBoxRectangles array is empty', () => {
            const props: ScreenshotContainerProps = {
                screenshotData: basicScreenshotData,
                highlightBoxRectangles: [],
            };

            const wrapper = shallow(<ScreenshotContainer {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('render when passed values for highlightBoxRectangles array', () => {
            const highlightBoxRectangles: BoundingRectangle[] = [
                { top: 0, bottom: 100, left: 0, right: 100 },
                { top: 150, bottom: 200, left: 150, right: 300 },
            ];

            const props: ScreenshotContainerProps = {
                screenshotData: basicScreenshotData,
                highlightBoxRectangles: highlightBoxRectangles,
            };

            const wrapper = shallow(<ScreenshotContainer {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });
});
