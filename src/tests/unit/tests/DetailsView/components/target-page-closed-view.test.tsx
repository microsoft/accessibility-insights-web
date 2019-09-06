// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { TargetPageClosedView } from '../../../../../DetailsView/components/target-page-closed-view';

describe('StaleView', () => {
    test('render stale view for default', () => {
        const testSubject = shallow(<TargetPageClosedView />);

        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
