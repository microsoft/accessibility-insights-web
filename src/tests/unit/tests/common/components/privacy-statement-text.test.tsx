// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
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

        const wrapper = shallow(<PrivacyStatementText deps={deps}></PrivacyStatementText>);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});

describe('PrivacyStatementPopupText', () => {
    it('renders', () => {
        const deps: PrivacyStatementTextDeps = {
            LinkComponent: NewTabLink,
        };

        const wrapper = shallow(
            <PrivacyStatementPopupText deps={deps}></PrivacyStatementPopupText>,
        );
        const privacyStatementText = wrapper.find(PrivacyStatementText);

        expect(wrapper.getElement()).toMatchSnapshot();
        expect(privacyStatementText.prop('deps').LinkComponent).toBe(deps.LinkComponent);
    });
});
