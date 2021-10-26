// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AdhocTabStopsTestView } from 'DetailsView/components/adhoc-tab-stops-test-view';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('AdhocTabStopsTestView', () => {
    it('renders with content', () => {
        const rendered = shallow(<AdhocTabStopsTestView />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
