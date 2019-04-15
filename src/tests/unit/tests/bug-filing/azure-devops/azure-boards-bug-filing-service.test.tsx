// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

import {
    AzureBoardsBugFilingService,
    AzureBoardsBugFilingSettings,
    AzureBoardsIssueDetailField,
} from '../../../../../bug-filing/azure-boards/azure-boards-bug-filing-service';
import { SettingsFormProps } from '../../../../../bug-filing/types/settings-form-props';
import { UserConfigMessageCreator } from '../../../../../common/message-creators/user-config-message-creator';
import { BugServicePropertiesMap } from '../../../../../common/types/store-data/user-configuration-store';

describe('AzureBoardsBugFilingServiceTest', () => {
    let userConfigMessageCreatorMock: IMock<UserConfigMessageCreator>;
    let props: SettingsFormProps<AzureBoardsBugFilingSettings>;
    let projectStub: string;
    let issueDetailsLocationStub: AzureBoardsIssueDetailField;

    const invalidTestSettings: AzureBoardsBugFilingSettings[] = [
        null,
        {} as AzureBoardsBugFilingSettings,
        undefined,
        { projectURL: '' } as AzureBoardsBugFilingSettings,
        { projectURL: '', issueDetailsLocationField: '' as AzureBoardsIssueDetailField },
        { projectURL: 'some project', issueDetailsLocationField: '' as AzureBoardsIssueDetailField },
        { projectURL: '', issueDetailsLocationField: 'some issue details location' as AzureBoardsIssueDetailField },
    ];

    beforeEach(() => {
        projectStub = 'some project';
        issueDetailsLocationStub = 'some location' as AzureBoardsIssueDetailField;
        userConfigMessageCreatorMock = Mock.ofType(UserConfigMessageCreator);
        props = {
            deps: {
                userConfigMessageCreator: userConfigMessageCreatorMock.object,
            },
            settings: {
                projectURL: 'some project',
                issueDetailsLocationField: 'some location' as AzureBoardsIssueDetailField,
            },
        };
    });

    it('static properties', () => {
        expect(AzureBoardsBugFilingService.key).toBe('azureBoards');
        expect(AzureBoardsBugFilingService.displayName).toBe('Azure Boards');
        expect(AzureBoardsBugFilingService.isHidden).toBeUndefined();
    });

    it('buildStoreData', () => {
        const expectedStoreData: AzureBoardsBugFilingSettings = {
            projectURL: projectStub,
            issueDetailsLocationField: issueDetailsLocationStub,
        };
        expect(AzureBoardsBugFilingService.buildStoreData(projectStub, issueDetailsLocationStub)).toEqual(expectedStoreData);
    });

    it('getSettingsFromStoreData', () => {
        const expectedStoreData: AzureBoardsBugFilingSettings = {
            projectURL: projectStub,
            issueDetailsLocationField: issueDetailsLocationStub,
        };
        const givenData: BugServicePropertiesMap = {
            'some other service': {},
            [AzureBoardsBugFilingService.key]: expectedStoreData,
        };
        expect(AzureBoardsBugFilingService.getSettingsFromStoreData(givenData)).toEqual(expectedStoreData);
    });

    describe('check for invalid settings', () => {
        it.each(invalidTestSettings)('with %o', settings => {
            expect(AzureBoardsBugFilingService.isSettingsValid(settings)).toBe(false);
        });
    });

    it('isSettingsValid - valid case', () => {
        const validSettings: AzureBoardsBugFilingSettings = {
            projectURL: 'some project',
            issueDetailsLocationField: 'some issue details location' as AzureBoardsIssueDetailField,
        };

        expect(AzureBoardsBugFilingService.isSettingsValid(validSettings)).toBe(true);
    });

    it('renderSettingsForm', () => {
        const Component = AzureBoardsBugFilingService.settingsForm;
        const wrapper = shallow(<Component {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    describe('create bug filing url', () => {
        it.each(invalidTestSettings)('with %o', settings => {
            expect(AzureBoardsBugFilingService.issueFilingUrlProvider(settings, null, null)).toBeNull();
        });
    });
});
