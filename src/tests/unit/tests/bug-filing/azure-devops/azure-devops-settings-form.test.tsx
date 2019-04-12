// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, MockBehavior } from 'typemoq';

import { AzureDevOpsBugFilingSettings } from '../../../../../bug-filing/azure-devops/azure-devops-bug-filing-service';
import { AzureDevOpsSettingsForm } from '../../../../../bug-filing/azure-devops/azure-devops-settings-form';
import { SettingsFormProps } from '../../../../../bug-filing/types/settings-form-props';
import { UserConfigMessageCreator } from '../../../../../common/message-creators/user-config-message-creator';
import { SettingsDeps } from '../../../../../DetailsView/components/settings-panel/settings/settings-props';

describe('AzureDevOpsSettingsForm', () => {
    let props: SettingsFormProps<AzureDevOpsBugFilingSettings>;
    let deps: SettingsDeps;
    let settingsStub: AzureDevOpsBugFilingSettings;
    let userConfigMessageCreatorMock: IMock<UserConfigMessageCreator>;

    beforeEach(() => {
        userConfigMessageCreatorMock = Mock.ofType(UserConfigMessageCreator, MockBehavior.Strict);
        settingsStub = { projectURL: 'some project URL', issueDetailsLocationField: 'description' };

        deps = {
            userConfigMessageCreator: userConfigMessageCreatorMock.object,
        };

        props = {
            deps: deps,
            settings: settingsStub,
        };
    });

    it('renders', () => {
        const testSubject = shallow(<AzureDevOpsSettingsForm {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });

    it('renders when settings Stub is null', () => {
        settingsStub = null;
        const testSubject = shallow(<AzureDevOpsSettingsForm {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
