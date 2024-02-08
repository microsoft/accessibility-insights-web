// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { Dropdown, TextField } from '@fluentui/react';
import { SettingsDeps } from 'DetailsView/components/details-view-overlay/settings-panel/settings/settings-props';
import { OnPropertyUpdateCallback } from 'issue-filing/components/issue-filing-settings-container';
import { getAzureBoardsIssueFilingService } from 'issue-filing/services/azure-boards/azure-boards-issue-filing-service';
import { AzureBoardsIssueFilingSettings } from 'issue-filing/services/azure-boards/azure-boards-issue-filing-settings';
import { AzureBoardsSettingsForm } from 'issue-filing/services/azure-boards/azure-boards-settings-form';
import { SettingsFormProps } from 'issue-filing/types/settings-form-props';
import * as React from 'react';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { IMock, Mock, Times } from 'typemoq';
import { expectMockedComponentPropsToMatchSnapshots, getMockComponentClassPropsForCall, mockReactComponents } from '../../../../mock-helpers/mock-module-helpers';

jest.mock('@fluentui/react');
describe('AzureBoardsSettingsForm', () => {
    mockReactComponents([TextField, Dropdown]);
    let props: SettingsFormProps<AzureBoardsIssueFilingSettings>;
    let deps: SettingsDeps;
    let settingsStub: AzureBoardsIssueFilingSettings;
    let onPropertyUpdateCallbackMock: IMock<OnPropertyUpdateCallback>;
    const azureBoardsIssueFilingService = getAzureBoardsIssueFilingService(null);

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
            const renderResult = render(<AzureBoardsSettingsForm {...props} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
            expectMockedComponentPropsToMatchSnapshots([Dropdown]);
        });

        it('settings is null', () => {
            props.settings = null;
            const renderResult = render(<AzureBoardsSettingsForm {...props} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
            expectMockedComponentPropsToMatchSnapshots([Dropdown]);
        });
    });

    describe('user interaction', () => {
        const eventStub = new EventStubFactory().createMouseClickEvent();
        it('handles project url change', () => {
            const newProjectUrl = 'a different project URL';

            const projectUrlProperty: keyof AzureBoardsIssueFilingSettings = 'projectURL';
            const payload = {
                issueFilingServiceName: azureBoardsIssueFilingService.key,
                propertyName: projectUrlProperty,
                propertyValue: newProjectUrl,
            };
            onPropertyUpdateCallbackMock
                .setup(updateCallback => updateCallback(payload))
                .verifiable(Times.once());

            render(<AzureBoardsSettingsForm {...props} />);
            getMockComponentClassPropsForCall(TextField).onChange(eventStub, newProjectUrl);

            onPropertyUpdateCallbackMock.verifyAll();
        });

        it('handles issues details field change', () => {
            const newIssueDetailsFieldKey = 'a-different-field-key';

            const issueDetailsFieldProperty: keyof AzureBoardsIssueFilingSettings =
                'issueDetailsField';
            const payload = {
                issueFilingServiceName: azureBoardsIssueFilingService.key,
                propertyName: issueDetailsFieldProperty,
                propertyValue: newIssueDetailsFieldKey,
            };
            onPropertyUpdateCallbackMock
                .setup(updateCallback => updateCallback(payload))
                .verifiable(Times.once());

            render(<AzureBoardsSettingsForm {...props} />);

            getMockComponentClassPropsForCall(Dropdown).onChange(null, { key: newIssueDetailsFieldKey });

            onPropertyUpdateCallbackMock.verifyAll();
        });
    });
});
