// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IframeSkippedWarning } from 'DetailsView/components/iframe-skipped-warning';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('IframeSkippedWarning', () => {
    test('render', () => {
        const wrapper = shallow(<IframeSkippedWarning />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
