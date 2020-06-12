// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { AndroidSetupStepContainer } from 'electron/views/device-connect-view/components/android-setup/android-setup-step-container';
import { render, shallow } from 'enzyme';
import * as React from 'react';
import { AndroidSetupStepPropsBuilder } from 'tests/unit/common/android-setup-step-props-builder';

describe('AndroidSetupStepContainer', () => {
    const props = new AndroidSetupStepPropsBuilder('detect-adb')
        .withDep('androidSetupStepComponentProvider', {
            'detect-adb': NamedFC('DetectTestComponent', p => (
                <>test component A {p.androidSetupStoreData.currentStepId}</>
            )),
            'prompt-locate-adb': NamedFC('PromptTestComponent', p => (
                <>test component B {p.androidSetupStoreData.currentStepId}</>
            )),
        })
        .build();

    it('passes common props and deps through', () => {
        const rendered = shallow(<AndroidSetupStepContainer {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders step HTML', () => {
        const rendered = render(<AndroidSetupStepContainer {...props} />);
        expect(rendered.html()).toMatchSnapshot();
    });

    it('renders different step', () => {
        props.androidSetupStoreData.currentStepId = 'prompt-locate-adb';
        const rendered = render(<AndroidSetupStepContainer {...props} />);
        expect(rendered.html()).toMatchSnapshot();
    });
});
