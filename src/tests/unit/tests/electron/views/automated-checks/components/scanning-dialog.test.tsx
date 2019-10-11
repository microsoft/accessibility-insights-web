// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanningDialog } from 'electron/views/automated-checks/components/scanning-dialog';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('ScanningDialog', () => {
    it('renders', () => {
        const wrapped = shallow(<ScanningDialog />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
