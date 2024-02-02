// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { TargetPageHiddenBar } from 'DetailsView/components/target-page-hidden-bar';
import * as React from 'react';

describe('TargetPageHiddenBar', () => {
    it('renders per snapshot to indicate that the target page is hidden', () => {
        const renderResult = render(<TargetPageHiddenBar isTargetPageHidden={true} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders as null when the target page is not hidden', () => {
        const renderResult = render(<TargetPageHiddenBar isTargetPageHidden={false} />);

        expect(renderResult.container.firstChild).toBeNull();
    });
});
