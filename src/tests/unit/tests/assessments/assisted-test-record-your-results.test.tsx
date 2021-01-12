// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssistedTestRecordYourResults } from 'assessments/common/assisted-test-record-your-results';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('AssistedTestRecordYourResults', () => {
    it('renders', () => {
        const wrapped = shallow(<AssistedTestRecordYourResults />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
