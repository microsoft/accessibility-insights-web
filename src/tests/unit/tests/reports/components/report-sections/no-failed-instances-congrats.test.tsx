// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { shallow } from 'enzyme';
import {
    NoFailedInstancesCongrats,
    NoFailedInstancesCongratsDeps,
} from 'reports/components/report-sections/no-failed-instances-congrats';

describe('NoFailedInstancesCongrats with default message', () => {
    it('renders', () => {
        const deps: NoFailedInstancesCongratsDeps = {
            customCongratsMessage: null,
        };
        const wrapper = shallow(<NoFailedInstancesCongrats deps={deps} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});

describe('NoFailedInstancesCongrats with custom message', () => {
    it('renders', () => {
        const deps: NoFailedInstancesCongratsDeps = {
            customCongratsMessage: 'Look, ma! No bugs!',
        };
        const wrapper = shallow(<NoFailedInstancesCongrats deps={deps} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
