// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { AssistedTestRecordYourResults } from 'assessments/common/assisted-test-record-your-results';
import * as React from 'react';

describe('AssistedTestRecordYourResults', () => {
    it('renders', () => {
        const renderResult = render(<AssistedTestRecordYourResults />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
