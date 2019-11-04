// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScreenshotView, ScreenshotViewProps } from 'electron/views/screenshot/screenshot-view';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('ScreenshotView', () => {
    describe('renders', () => {
        it('when passed a value for screenshotData', () => {
            const props: ScreenshotViewProps = {
                screenshotData: { base64PngData: 'test-base-64-png-data' },
            };
            const wrapper = shallow(<ScreenshotView {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('when passed an empty value for screenshotData', () => {
            const props = {
                screenshotData: {},
            } as ScreenshotViewProps;

            const wrapper = shallow(<ScreenshotView {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('when passed an null value for screenshotData', () => {
            const props = {
                screenshotData: null,
            } as ScreenshotViewProps;

            const wrapper = shallow(<ScreenshotView {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('when passed an undefined value for screenshotData', () => {
            const props = {
                screenshotData: undefined,
            } as ScreenshotViewProps;

            const wrapper = shallow(<ScreenshotView {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });
});
