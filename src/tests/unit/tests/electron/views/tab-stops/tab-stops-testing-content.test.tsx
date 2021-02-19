// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    TabStopsTestingContentProps,
    TabStopsTestingContent,
} from 'electron/views/tab-stops/tab-stops-testing-content';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('TabStopsTestingContent', () => {
    let props: TabStopsTestingContentProps;

    beforeEach(() => {
        props = {
            deps: {},
            showTabStops: true,
        };
    });

    test('renders', () => {
        const testSubject = shallow(<TabStopsTestingContent {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
