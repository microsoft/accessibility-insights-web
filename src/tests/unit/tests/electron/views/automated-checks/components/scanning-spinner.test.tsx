// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanningSpinner } from 'electron/views/automated-checks/components/scanning-spinner';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('ScanningSpinner', () => {
    describe('renders', () => {
        const isScanningValues = [true, false];

        it.each(isScanningValues)('isScanning = <%s>', isScanning => {
            const props = {
                isScanning,
            };
            const wrapped = shallow(<ScanningSpinner {...props} />);

            expect(wrapped.getElement()).toMatchSnapshot();
        });
    });
});
