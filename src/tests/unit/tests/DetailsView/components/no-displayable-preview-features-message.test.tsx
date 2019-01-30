// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { NoDisplayableFeatureFlagMessage } from '../../../../../DetailsView/components/no-displayable-preview-features-message';

describe('no displayableFeatureFlags message test', () => {
    test('the no feature flag message component', () => {
        const testSubject = shallow(<NoDisplayableFeatureFlagMessage />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
