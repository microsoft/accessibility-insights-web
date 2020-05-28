// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedHeaderSection } from 'electron/views/report/unified-header-section';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('HeaderSection', () => {
    it('renders', () => {
        const wrapper = shallow(<UnifiedHeaderSection />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
