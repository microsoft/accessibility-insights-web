// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';

import { NoDisplayableFeatureFlagMessage } from '../../../../../DetailsView/components/no-displayable-preview-features-message';

describe('no displayableFeatureFlags message test', () => {
    test('the no feature flag message component', () => {
        const renderResult = render(<NoDisplayableFeatureFlagMessage />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
