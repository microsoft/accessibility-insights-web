// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScreenshotData } from 'common/types/store-data/unified-data-interface';
import {
    ScreenshotContainer,
    ScreenshotContainerProps,
} from 'electron/views/screenshot/screenshot-container';
import { HighlightBoxViewModel } from 'electron/views/screenshot/screenshot-view-model';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('ScreenshotContainer', () => {
    const basicScreenshotData: ScreenshotData = { base64PngData: 'test-base-64-png-data' };

    it('renders per snapshot with no highlight boxes', () => {
        const props: ScreenshotContainerProps = {
            screenshotData: basicScreenshotData,
            highlightBoxViewModels: [],
        };

        const wrapper = shallow(<ScreenshotContainer {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders per snapshot with highlight boxes', () => {
        const highlightBoxViewModels: HighlightBoxViewModel[] = [
            {
                resultUid: 'result-1',
                label: null,
                top: 'top-1',
                left: 'left-1',
                width: 'width-1',
                height: 'height-1',
            },
            {
                resultUid: 'result-2',
                label: '!',
                top: 'top-2',
                left: 'left-2',
                width: 'width-2',
                height: 'height-2',
            },
        ];

        const props: ScreenshotContainerProps = {
            screenshotData: basicScreenshotData,
            highlightBoxViewModels,
        };

        const wrapper = shallow(<ScreenshotContainer {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
