// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AndroidSetupActionCreator } from 'electron/flux/action-creator/android-setup-action-creator';
import {
    AndroidSetupSpinnerStep,
    AndroidSetupSpinnerStepDeps,
    AndroidSetupSpinnerStepProps,
} from 'electron/views/device-connect-view/components/android-setup/android-setup-spinner-step';
import { AndroidSetupStepLayout } from 'electron/views/device-connect-view/components/android-setup/android-setup-step-layout';
import { shallow } from 'enzyme';
import * as React from 'react';
import { It, Mock, MockBehavior } from 'typemoq';

describe('AndroidSetupSpinner', () => {
    it('renders per snapshot', () => {
        const stubDeps = {
            androidSetupActionCreator: {} as AndroidSetupActionCreator,
        } as AndroidSetupSpinnerStepDeps;

        const rendered = shallow(
            <AndroidSetupSpinnerStep deps={stubDeps} spinnerLabel="test label" />,
        );
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('handles the cancel button with the cancel action', () => {
        const mockCancelAction = Mock.ofInstance(_ => {}, MockBehavior.Strict);
        mockCancelAction.setup(m => m(It.isAny())).verifiable();

        const props: AndroidSetupSpinnerStepProps = {
            deps: {
                androidSetupActionCreator: {
                    cancel: mockCancelAction.object,
                } as AndroidSetupActionCreator,
            },
            spinnerLabel: 'irrelevant',
        };

        const rendered = shallow(<AndroidSetupSpinnerStep {...props} />);

        const stubEvent = {} as React.MouseEvent<HTMLButtonElement>;
        rendered.find(AndroidSetupStepLayout).prop('leftFooterButtonProps').onClick(stubEvent);

        mockCancelAction.verifyAll();
    });
});
