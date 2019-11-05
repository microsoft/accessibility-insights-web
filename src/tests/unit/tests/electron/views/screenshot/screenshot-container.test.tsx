// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScreenshotData } from 'common/types/store-data/unified-data-interface';
import { BoundingRectangle } from 'electron/platform/android/scan-results';
import { ScreenshotContainer, ScreenshotContainerProps } from 'electron/views/screenshot/screenshot-container';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('ScreenshotContainer', () => {
    const boundingRectangles: BoundingRectangle[] = [
        { top: 0, bottom: 100, left: 0, right: 100 },
        { top: 150, bottom: 200, left: 150, right: 300 },
    ];
    const basicScreenshotData: ScreenshotData = { base64PngData: 'test-base-64-png-data' };
    describe('renders', () => {
        it('when passed a value for screenshotData', () => {
            const props: ScreenshotContainerProps = {
                screenshotData: basicScreenshotData,
            };
            const wrapper = shallow(<ScreenshotContainer {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('when passed an empty value for screenshotData', () => {
            const props = {
                screenshotData: {},
            } as ScreenshotContainerProps;

            const wrapper = shallow(<ScreenshotContainer {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('when passed an null value for screenshotData', () => {
            const props = {
                screenshotData: null,
            } as ScreenshotContainerProps;

            const wrapper = shallow(<ScreenshotContainer {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('when passed an undefined value for screenshotData', () => {
            const props = {
                screenshotData: undefined,
            } as ScreenshotContainerProps;

            const wrapper = shallow(<ScreenshotContainer {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });

    describe('highlight boxes', () => {
        it('do not render when boundingRectangles array is empty', () => {
            const props: ScreenshotContainerProps = {
                screenshotData: basicScreenshotData,
                highlightBoxes: [],
            };

            const wrapper = shallow(<ScreenshotContainer {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('do not render when boundingRectangles array is not in props', () => {
            const props: ScreenshotContainerProps = {
                screenshotData: basicScreenshotData,
            };

            const wrapper = shallow(<ScreenshotContainer {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('render when passed values for boundingRectangles array', () => {
            const props: ScreenshotContainerProps = {
                screenshotData: basicScreenshotData,
                highlightBoxes: boundingRectangles,
            };
            const wrapper = shallow(<ScreenshotContainer {...props} />);
            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });
});
