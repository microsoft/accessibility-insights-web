// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { TargetPageInfoBar } from 'DetailsView/components/target-page-info-bar';

describe('TargetPageInfoBar', () => {
    it('renders per snapshot to indicate that the target page is hidden', () => {
        const testSubject = shallow(<TargetPageInfoBar isTargetPageHidden={true} />);

        expect(testSubject.debug()).toMatchSnapshot();
    });

    it('renders as null when the target page is not hidden', () => {
        const testSubject = shallow(<TargetPageInfoBar isTargetPageHidden={false} />);

        expect(testSubject.getElement()).toBeNull();
    });
});
