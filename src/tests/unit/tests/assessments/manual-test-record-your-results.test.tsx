// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Enzyme from 'enzyme';
import * as React from 'react';

import ManualTestRecordYourResults from '../../../../assessments/common/manual-test-record-your-results';

describe('ManualTestRecordYourResultsTest', () => {
    test('render: isMultipleFailurePossible = false', () => {
        const props = { isMultipleFailurePossible: false };
        const wrapper = Enzyme.shallow(<ManualTestRecordYourResults {...props} />);
        const li = wrapper
            .find('li')
            .at(1)
            .getElement();
        expect(li.props.children[1]).toBe('a failure');
        expect(li.props.children[5]).toBe(' then add the failure instance');
    });

    test('render: isMultipleFailurePossible = true', () => {
        const props = { isMultipleFailurePossible: true };
        const wrapper = Enzyme.shallow(<ManualTestRecordYourResults {...props} />);
        const li = wrapper
            .find('li')
            .at(1)
            .getElement();
        expect(li.props.children[1]).toBe('any failures');
        expect(li.props.children[5]).toBe(' then add them as failure instances');
    });
});
