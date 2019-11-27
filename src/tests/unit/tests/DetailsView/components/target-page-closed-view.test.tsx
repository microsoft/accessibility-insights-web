// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NoContentAvailable } from 'DetailsView/components/target-page-closed-view';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('NoContentAvailable', () => {
    it('renders stale view for default', () => {
        const testSubject = shallow(<NoContentAvailable />);

        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
