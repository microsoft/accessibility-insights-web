// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BoundingRectangle } from 'electron/platform/android/scan-results';
import { HighlightBox, HighlightBoxDeps, HighlightBoxProps } from 'electron/views/screenshot/highlight-box';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('HighlightBox', () => {
    let deps: HighlightBoxDeps;
    let boundingRectangle: BoundingRectangle;
    let props: HighlightBoxProps;

    beforeEach(() => {
        deps = {};

        boundingRectangle = {
            top: 100,
            bottom: 250,
            left: 20,
            right: 400,
        };

        props = {
            deps,
            boundingRectangle,
        };
    });

    it('renders with appropriate position and dimensions', () => {
        const testObject = shallow(<HighlightBox {...props} />);
        expect(testObject.getElement()).toMatchSnapshot();
    });
});
