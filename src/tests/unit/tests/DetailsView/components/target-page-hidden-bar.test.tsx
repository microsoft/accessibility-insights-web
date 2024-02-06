// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { MessageBar } from '@fluentui/react';
import { render } from '@testing-library/react';
import { TargetPageHiddenBar } from 'DetailsView/components/target-page-hidden-bar';
import * as React from 'react';
import { mockReactComponents } from '../../../mock-helpers/mock-module-helpers';
jest.mock('@fluentui/react');

describe('TargetPageHiddenBar', () => {
    mockReactComponents([MessageBar]);
    it('renders per snapshot to indicate that the target page is hidden', () => {
        const renderResult = render(<TargetPageHiddenBar isTargetPageHidden={true} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders as null when the target page is not hidden', () => {
        const renderResult = render(<TargetPageHiddenBar isTargetPageHidden={false} />);

        expect(renderResult.container.firstChild).toBeNull();
    });
});
