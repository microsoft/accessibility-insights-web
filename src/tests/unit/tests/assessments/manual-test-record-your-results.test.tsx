// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ManualTestRecordYourResults } from 'assessments/common/manual-test-record-your-results';
import * as Enzyme from 'enzyme';
import * as React from 'react';

describe('ManualTestRecordYourResultsTest', () => {
    const multiple = [false, true];

    it.each(multiple)('render: isMultipleFailurePossible = %p', isMultipleFailurePossible => {
        const props = { isMultipleFailurePossible };
        const wrapper = Enzyme.shallow(<ManualTestRecordYourResults {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
