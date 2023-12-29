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
import { getMockComponentClassPropsForCall, mockReactComponents } from '../../../mock-helpers/mock-module-helpers';


jest.mock('../../../../../common/components/privacy-statement-text');

describe('PrivacyStatementText', () => {
    mockReactComponents([PrivacyStatementText, PrivacyStatementPopupText])
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

        const renderResult = render(<PrivacyStatementPopupText deps={deps} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        const privacyStatementPopupText = getMockComponentClassPropsForCall(PrivacyStatementPopupText); // manually added
        expect(privacyStatementPopupText.deps.LinkComponent).toBe(deps.LinkComponent); // manually added

    });
});
