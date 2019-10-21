// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanningSpinner } from 'electron/views/automated-checks/components/scanning-spinner';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('ScanningSpinner', () => {
    describe('renders', () => {
        const isSpinningValues = [true, false];

        it.each(isSpinningValues)('isScanning = <%s>', isSpinning => {
            const props = {
                isSpinning,
                label: 'test-label',
                ['aria-live']: 'test-aria-live' as any,
            };
            const wrapped = shallow(<ScanningSpinner {...props} />);

            expect(wrapped.getElement()).toMatchSnapshot();
        });
    });
});
