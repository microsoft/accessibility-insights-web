// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AndroidSetupStepLayout,
    AndroidSetupStepLayoutProps,
} from 'electron/views/device-connect-view/components/android-setup/android-setup-step-layout';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('AndroidSetupStepLayout', () => {
    let props: AndroidSetupStepLayoutProps;
    const stubChildContent = <p>child content</p>;
    beforeEach(() => {
        props = {
            leftFooterButtonProps: { text: 'left footer button' },
            rightFooterButtonProps: { text: 'right footer button' },
        };
    });

    it.each`
        withMoreInfo | withHeaderText
        ${true}      | ${true}
        ${false}     | ${true}
        ${false}     | ${false}
    `(
        'renders per snapshot (withMoreInfo=$withMoreInfo, withHeaderText=$withHeaderText)',
        ({ withMoreInfo, withHeaderText }) => {
            props.headerText = withHeaderText ? 'Header text' : undefined;
            props.moreInfoLink = withMoreInfo ? <a href="https://test">test link</a> : undefined;

            const rendered = shallow(
                <AndroidSetupStepLayout {...props}>{stubChildContent}</AndroidSetupStepLayout>,
            );
            expect(rendered.getElement()).toMatchSnapshot();
        },
    );
});
