// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';

import { Page, PageDeps } from 'views/page/page';
import { NarrowModeDetector } from '../../../../../DetailsView/components/narrow-mode-detector';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../DetailsView/components/narrow-mode-detector');
describe('page view', () => {
    mockReactComponents([NarrowModeDetector]);
    it('renders', () => {
        const renderResult = render(<Page deps={{} as PageDeps}>INSIDE</Page>);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([NarrowModeDetector]);
    });
});
