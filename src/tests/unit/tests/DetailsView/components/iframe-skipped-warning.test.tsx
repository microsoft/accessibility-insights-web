// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { IframeSkippedWarning } from 'DetailsView/components/iframe-skipped-warning';
import * as React from 'react';

describe('IframeSkippedWarning', () => {
    test('render', () => {
        const renderResult = render(<IframeSkippedWarning />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
