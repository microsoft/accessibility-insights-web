// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { NewTabLink } from '../../../../../common/components/new-tab-link';
import {
    PrivacyStatementPopupText,
    PrivacyStatementText,
    PrivacyStatementTextDeps,
} from '../../../../../common/components/privacy-statement-text';

describe('PrivacyStatementText', () => {
    it('renders', () => {
        const deps: PrivacyStatementTextDeps = {
            LinkComponent: NewTabLink,
        };

        const renderResult = render(<PrivacyStatementText deps={deps}></PrivacyStatementText>);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});

describe('PrivacyStatementPopupText', () => {
    it('renders', () => {
        const deps: PrivacyStatementTextDeps = {
            LinkComponent: NewTabLink,
        };

        const renderResult = render(<PrivacyStatementPopupText deps={deps}></PrivacyStatementPopupText>);
        const privacyStatementText = renderResult.getByRole('link');

        expect(renderResult.asFragment()).toMatchSnapshot();
        expect(privacyStatementText.textContent).toBe('privacy statement');
    });
});