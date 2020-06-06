// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AndroidSetupPromptLayout,
    AndroidSetupPromptLayoutProps,
} from 'electron/views/device-connect-view/components/android-setup/android-setup-prompt-layout';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('AndroidSetupPromptLayout', () => {
    let props: AndroidSetupPromptLayoutProps;
    const stubChildContent = <p>child content</p>;
    beforeEach(() => {
        props = {
            headerText: 'Header text',
            leftFooterButtonProps: { text: 'left footer button' },
            rightFooterButtonProps: { text: 'right footer button' },
        };
    });

    it('renders per snapshot without a moreInfoLink', () => {
        props.moreInfoLink = undefined;
        const rendered = shallow(
            <AndroidSetupPromptLayout {...props}>{stubChildContent}</AndroidSetupPromptLayout>,
        );
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders per snapshot with a moreInfoLink', () => {
        props.moreInfoLink = <a href="https://test">test link</a>;
        const rendered = shallow(
            <AndroidSetupPromptLayout {...props}>{stubChildContent}</AndroidSetupPromptLayout>,
        );
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
