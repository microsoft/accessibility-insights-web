// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanIncompleteWarningId } from 'common/types/scan-incomplete-warnings';
import { ScanIncompleteWarning, ScanIncompleteWarningProps } from 'DetailsView/components/scan-incomplete-warning';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('ScanIncompleteWarning', () => {
    beforeEach(() => {});
    test(`notRendered: where no warnings were provided`, () => {
        const componentProps: ScanIncompleteWarningProps = {
            warnings: [],
        };

        const testSubject = shallow(<ScanIncompleteWarning {...componentProps} />);

        expect(testSubject.getElement()).toMatchSnapshot();
    });

    test(`rendered: where warnings were provided`, () => {
        const componentProps: ScanIncompleteWarningProps = {
            warnings: ['missing-required-cross-origin-permissions', 'missing-required-cross-origin-permissions'],
        };

        const testSubject = shallow(<ScanIncompleteWarning {...componentProps} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });

    test(`rendered: where warnings were provided, with one warning not supported`, () => {
        const componentProps: ScanIncompleteWarningProps = {
            warnings: ['missing-required-cross-origin-permissions', 'not a real warning' as ScanIncompleteWarningId],
        };

        const testSubject = shallow(<ScanIncompleteWarning {...componentProps} />);

        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
