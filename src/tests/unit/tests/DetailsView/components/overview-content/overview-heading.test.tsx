// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';

import { OverviewHeading } from '../../../../../../DetailsView/components/overview-content/overview-heading';

describe('OverviewHeading', () => {
    test('match snapshot', () => {
        const getIntroComponentStub = () => <div>INTRO COMPONENT</div>;
        const renderResult = render(<OverviewHeading getIntroComponent={getIntroComponentStub} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
