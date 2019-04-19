// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import {
    AzureBoardsBugFilingService,
    AzureBoardsBugFilingSettings,
} from '../../../../../bug-filing/azure-boards/azure-boards-bug-filing-service';
import { AzureBoardsSettingsForm } from '../../../../../bug-filing/azure-boards/azure-boards-settings-form';
import { OnPropertyUpdateCallback } from '../../../../../bug-filing/components/bug-filing-settings-container';
import { SettingsFormProps } from '../../../../../bug-filing/types/settings-form-props';
import { SettingsDeps } from '../../../../../DetailsView/components/settings-panel/settings/settings-props';
import { EventStubFactory } from '../../../common/event-stub-factory';

describe('AzureBoardsSettingsForm', () => {
    let props: SettingsFormProps<AzureBoardsBugFilingSettings>;
    let deps: SettingsDeps;
    let settingsStub: AzureBoardsBugFilingSettings;
    let onPropertyUpdateCallbackMock: IMock<OnPropertyUpdateCallback>;

    beforeEach(() => {
        settingsStub = { projectURL: 'some project URL', issueDetailsField: 'description' };
        onPropertyUpdateCallbackMock = Mock.ofInstance(() => null);

        deps = {
            userConfigMessageCreator: null,
        } as SettingsDeps;

        props = {
            deps: deps,
            settings: settingsStub,
            onPropertyUpdateCallback: onPropertyUpdateCallbackMock.object,
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
            onPropertyUpdateCallbackMock
                .setup(mock => mock(AzureBoardsBugFilingService.key, projectUrlProperty, newProjectUrl))
                .verifiable(Times.once());

            const testSubject = shallow(<AzureBoardsSettingsForm {...props} />);

            testSubject.find(TextField).simulate('change', eventStub, newProjectUrl);

            onPropertyUpdateCallbackMock.verifyAll();
        });

        it('handles issues details field change', () => {
            const newIssueDetailsFieldKey = 'a-different-field-key';

            const issueDetailsFieldProperty: keyof AzureBoardsBugFilingSettings = 'issueDetailsField';
            onPropertyUpdateCallbackMock
                .setup(mock => mock(AzureBoardsBugFilingService.key, issueDetailsFieldProperty, newIssueDetailsFieldKey))
                .verifiable(Times.once());

            const testSubject = shallow(<AzureBoardsSettingsForm {...props} />);

            testSubject.find(Dropdown).simulate('change', null, { key: newIssueDetailsFieldKey });

            onPropertyUpdateCallbackMock.verifyAll();
        });
    });
});
