// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { ManualTestRecordYourResults } from 'assessments/common/manual-test-record-your-results';
import * as React from 'react';

describe('ManualTestRecordYourResultsTest', () => {
    const multiple = [false, true];

    it.each(multiple)('render: isMultipleFailurePossible = %p', isMultipleFailurePossible => {
        const props = { isMultipleFailurePossible };
        const wrapper = render(<ManualTestRecordYourResults {...props} />);

        expect(wrapper.asFragment()).toMatchSnapshot();
    });
});
