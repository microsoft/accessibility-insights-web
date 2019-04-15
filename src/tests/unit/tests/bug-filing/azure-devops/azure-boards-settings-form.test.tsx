// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

import {
    AzureBoardsBugFilingSettings,
    AzureBoardsBugFilingService,
} from '../../../../../bug-filing/azure-boards/azure-boards-bug-filing-service';
import { AzureBoardsSettingsForm } from '../../../../../bug-filing/azure-boards/azure-boards-settings-form';
import { SettingsFormProps } from '../../../../../bug-filing/types/settings-form-props';
import { UserConfigMessageCreator } from '../../../../../common/message-creators/user-config-message-creator';
import { SettingsDeps } from '../../../../../DetailsView/components/settings-panel/settings/settings-props';
import { EventStubFactory } from '../../../common/event-stub-factory';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { TextField } from 'office-ui-fabric-react/lib/TextField';

describe('AzureBoardsSettingsForm', () => {
    let props: SettingsFormProps<AzureBoardsBugFilingSettings>;
    let deps: SettingsDeps;
    let settingsStub: AzureBoardsBugFilingSettings;
    let userConfigMessageCreatorMock: IMock<UserConfigMessageCreator>;

    beforeEach(() => {
        userConfigMessageCreatorMock = Mock.ofType(UserConfigMessageCreator, MockBehavior.Strict);
        settingsStub = { projectURL: 'some project URL', issueDetailsField: 'description' };

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
            const testSubject = shallow(<AzureBoardsSettingsForm {...props} />);
            expect(testSubject.getElement()).toMatchSnapshot();
        });

        it('settings is null', () => {
            props.settings = null;
            const testSubject = shallow(<AzureBoardsSettingsForm {...props} />);
            expect(testSubject.getElement()).toMatchSnapshot();
        });
    });

    describe('user interaction', () => {
        const eventStub = new EventStubFactory().createMouseClickEvent();
        it('handles project url change', () => {
            const newProjectUrl = 'a different project URL';

            const projectUrlProperty: keyof AzureBoardsBugFilingSettings = 'projectURL';
            userConfigMessageCreatorMock
                .setup(creator => creator.setBugServiceProperty(AzureBoardsBugFilingService.key, projectUrlProperty, newProjectUrl))
                .verifiable(Times.once());

            const testSubject = shallow(<AzureBoardsSettingsForm {...props} />);

            testSubject.find(TextField).simulate('change', eventStub, newProjectUrl);

            userConfigMessageCreatorMock.verifyAll();
        });

        it('handles issues details field change', () => {
            const newIssueDetailsFieldKey = 'a-different-field-key';

            const issueDetailsFieldProperty: keyof AzureBoardsBugFilingSettings = 'issueDetailsField';
            userConfigMessageCreatorMock
                .setup(creator =>
                    creator.setBugServiceProperty(AzureBoardsBugFilingService.key, issueDetailsFieldProperty, newIssueDetailsFieldKey),
                )
                .verifiable(Times.once());

            const testSubject = shallow(<AzureBoardsSettingsForm {...props} />);

            testSubject.find(Dropdown).simulate('change', null, { key: newIssueDetailsFieldKey });

            userConfigMessageCreatorMock.verifyAll();
        });
    });
});
