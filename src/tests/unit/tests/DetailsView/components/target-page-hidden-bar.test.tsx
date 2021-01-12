// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TargetPageHiddenBar } from 'DetailsView/components/target-page-hidden-bar';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('TargetPageHiddenBar', () => {
    it('renders per snapshot to indicate that the target page is hidden', () => {
        const testSubject = shallow(<TargetPageHiddenBar isTargetPageHidden={true} />);

        expect(testSubject.debug()).toMatchSnapshot();
    });

    it('renders as null when the target page is not hidden', () => {
        const testSubject = shallow(<TargetPageHiddenBar isTargetPageHidden={false} />);

        expect(testSubject.getElement()).toBeNull();
    });
});
