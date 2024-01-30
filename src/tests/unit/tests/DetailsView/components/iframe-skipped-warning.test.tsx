// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { IframeSkippedWarning } from 'DetailsView/components/iframe-skipped-warning';
import * as React from 'react';
import { NewTabLink } from '../../../../../common/components/new-tab-link';
import { mockReactComponents } from '../../../mock-helpers/mock-module-helpers';
jest.mock('../../../../../common/components/new-tab-link');

describe('IframeSkippedWarning', () => {
    mockReactComponents([NewTabLink]);
    test('render', () => {
        const renderResult = render(<IframeSkippedWarning />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
