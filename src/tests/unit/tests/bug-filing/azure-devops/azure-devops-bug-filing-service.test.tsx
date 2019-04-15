// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

import {
    AzureDevOpsBugFilingService,
    AzureDevOpsBugFilingSettings,
    AzureDevOpsIssueDetailLocation,
} from '../../../../../bug-filing/azure-devops/azure-devops-bug-filing-service';
import { SettingsFormProps } from '../../../../../bug-filing/types/settings-form-props';
import { UserConfigMessageCreator } from '../../../../../common/message-creators/user-config-message-creator';
import { BugServicePropertiesMap } from '../../../../../common/types/store-data/user-configuration-store';

describe('AzureDevOpsBugFilingServiceTest', () => {
    let userConfigMessageCreatorMock: IMock<UserConfigMessageCreator>;
    let props: SettingsFormProps<AzureDevOpsBugFilingSettings>;
    let projectStub: string;
    let issueDetailsLocationStub: AzureDevOpsIssueDetailLocation;

    const invalidTestSettings: AzureDevOpsBugFilingSettings[] = [
        null,
        {} as AzureDevOpsBugFilingSettings,
        undefined,
        { projectURL: '' } as AzureDevOpsBugFilingSettings,
        { projectURL: '', issueDetailsField: '' as AzureDevOpsIssueDetailLocation },
        { projectURL: 'some project', issueDetailsField: '' as AzureDevOpsIssueDetailLocation },
        { projectURL: '', issueDetailsField: 'some issue details location' as AzureDevOpsIssueDetailLocation },
    ];

    beforeEach(() => {
        projectStub = 'some project';
        issueDetailsLocationStub = 'description';
        userConfigMessageCreatorMock = Mock.ofType(UserConfigMessageCreator);
        props = {
            deps: {
                userConfigMessageCreator: userConfigMessageCreatorMock.object,
            },
            settings: {
                projectURL: 'some project',
                issueDetailsField: 'description',
            },
        };
    });

    it('static properties', () => {
        expect(AzureDevOpsBugFilingService.key).toBe('azureDevOps');
        expect(AzureDevOpsBugFilingService.displayName).toBe('Azure DevOps');
        expect(AzureDevOpsBugFilingService.isHidden).toBeUndefined();
    });

    it('buildStoreData', () => {
        const expectedStoreData: AzureDevOpsBugFilingSettings = {
            projectURL: projectStub,
            issueDetailsField: issueDetailsLocationStub,
        };
        expect(AzureDevOpsBugFilingService.buildStoreData(projectStub, issueDetailsLocationStub)).toEqual(expectedStoreData);
    });

    it('getSettingsFromStoreData', () => {
        const expectedStoreData: AzureDevOpsBugFilingSettings = {
            projectURL: projectStub,
            issueDetailsField: issueDetailsLocationStub,
        };
        const givenData: BugServicePropertiesMap = {
            'some other service': {},
            [AzureDevOpsBugFilingService.key]: expectedStoreData,
        };
        expect(AzureDevOpsBugFilingService.getSettingsFromStoreData(givenData)).toEqual(expectedStoreData);
    });

    describe('check for invalid settings', () => {
        it.each(invalidTestSettings)('with %o', settings => {
            expect(AzureDevOpsBugFilingService.isSettingsValid(settings)).toBe(false);
        });
    });

    it('isSettingsValid - valid case', () => {
        const validSettings: AzureDevOpsBugFilingSettings = {
            projectURL: 'some project',
            issueDetailsField: 'description',
        };

        expect(AzureDevOpsBugFilingService.isSettingsValid(validSettings)).toBe(true);
    });

    it('renderSettingsForm', () => {
        const Component = AzureDevOpsBugFilingService.settingsForm;
        const wrapper = shallow(<Component {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    describe('create bug filing url', () => {
        it.each(invalidTestSettings)('with %o', settings => {
            expect(AzureDevOpsBugFilingService.issueFilingUrlProvider(settings, null, null)).toBeNull();
        });
    });
});
