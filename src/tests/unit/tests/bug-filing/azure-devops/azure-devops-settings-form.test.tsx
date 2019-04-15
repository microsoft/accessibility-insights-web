// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';
import {
    AzureDevOpsBugFilingService,
    AzureDevOpsBugFilingSettings,
} from '../../../../../bug-filing/azure-devops/azure-devops-bug-filing-service';
import { AzureDevOpsSettingsForm } from '../../../../../bug-filing/azure-devops/azure-devops-settings-form';
import { SettingsFormProps } from '../../../../../bug-filing/types/settings-form-props';
import { UserConfigMessageCreator } from '../../../../../common/message-creators/user-config-message-creator';
import { SettingsDeps } from '../../../../../DetailsView/components/settings-panel/settings/settings-props';
import { EventStubFactory } from '../../../common/event-stub-factory';

describe('AzureDevOpsSettingsForm', () => {
    let props: SettingsFormProps<AzureDevOpsBugFilingSettings>;
    let deps: SettingsDeps;
    let userConfigMessageCreatorMock: IMock<UserConfigMessageCreator>;

    beforeEach(() => {
        userConfigMessageCreatorMock = Mock.ofType(UserConfigMessageCreator, MockBehavior.Strict);
        const settingsStub: AzureDevOpsBugFilingSettings = { projectURL: 'some project URL', issueDetailsLocationField: 'description' };

        deps = {
            userConfigMessageCreator: userConfigMessageCreatorMock.object,
        };

        props = {
            deps: deps,
            settings: settingsStub,
        };
    });

    describe('renders', () => {
        it('with projectUrl and issueDetailsField', () => {
            const testSubject = shallow(<AzureDevOpsSettingsForm {...props} />);
            expect(testSubject.getElement()).toMatchSnapshot();
        });

        it('settings is null', () => {
            props.settings = null;
            const testSubject = shallow(<AzureDevOpsSettingsForm {...props} />);
            expect(testSubject.getElement()).toMatchSnapshot();
        });
    });

    describe('user interaction', () => {
        const eventStub = new EventStubFactory().createMouseClickEvent();
        it('handles project url change', () => {
            const newProjectUrl = 'a different project URL';

            const projectUrlProperty: keyof AzureDevOpsBugFilingSettings = 'projectURL';
            userConfigMessageCreatorMock
                .setup(creator => creator.setBugServiceProperty(AzureDevOpsBugFilingService.key, projectUrlProperty, newProjectUrl))
                .verifiable(Times.once());

            const testSubject = shallow(<AzureDevOpsSettingsForm {...props} />);

            testSubject.find(TextField).simulate('change', eventStub, newProjectUrl);

            userConfigMessageCreatorMock.verifyAll();
        });

        it('handles issues details field change', () => {
            const newIssueDetailsFieldKey = 'a-different-field-key';

            const issueDetailsFieldProperty: keyof AzureDevOpsBugFilingSettings = 'issueDetailsLocationField';
            userConfigMessageCreatorMock
                .setup(creator =>
                    creator.setBugServiceProperty(AzureDevOpsBugFilingService.key, issueDetailsFieldProperty, newIssueDetailsFieldKey),
                )
                .verifiable(Times.once());

            const testSubject = shallow(<AzureDevOpsSettingsForm {...props} />);

            testSubject.find(Dropdown).simulate('change', null, { key: newIssueDetailsFieldKey });

            userConfigMessageCreatorMock.verifyAll();
        });
    });
});
