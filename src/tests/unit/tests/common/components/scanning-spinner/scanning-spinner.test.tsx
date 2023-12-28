// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { ScanningSpinner } from 'common/components/scanning-spinner/scanning-spinner';
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
            const renderResult = render(<ScanningSpinner {...props} />);

            expect(renderResult.asFragment()).toMatchSnapshot();
        });
    });
});
