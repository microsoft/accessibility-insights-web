// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import {
    AzureDevOpsBugFilingService,
    AzureDevOpsBugFilingSettings,
} from '../../../../../bug-filing/azure-devops/azure-devops-bug-filing-service';
import { SettingsFormProps } from '../../../../../bug-filing/types/settings-form-props';
import { UserConfigMessageCreator } from '../../../../../common/message-creators/user-config-message-creator';
import { BugServicePropertiesMap } from '../../../../../common/types/store-data/user-configuration-store';

describe('AzureDevOpsBugFilingServiceTest', () => {
    let userConfigMessageCreatorMock: IMock<UserConfigMessageCreator>;
    let props: SettingsFormProps<AzureDevOpsBugFilingSettings>;
    let projectStub: string;
    let issueDetailsLocationStub: string;

    const invalidTestSettings = [
        null,
        {},
        undefined,
        { random: '' },
        { project: '' },
        { project: '', issueDetailsLocation: '' },
        { project: 'some project', issueDetailsLocation: '' },
        { project: '', issueDetailsLocation: 'some issue details location' },
    ];

    beforeEach(() => {
        projectStub = 'some project';
        issueDetailsLocationStub = 'some location';
        userConfigMessageCreatorMock = Mock.ofType(UserConfigMessageCreator);
        props = {
            deps: {
                userConfigMessageCreator: userConfigMessageCreatorMock.object,
            },
            settings: {
                project: 'some project',
                issueDetailsLocation: 'some location',
            },
        };
    });

    it('static properties', () => {
        expect(AzureDevOpsBugFilingService.key).toBe('azureDevOps');
        expect(AzureDevOpsBugFilingService.displayName).toBe('AzureDevOps');
        expect(AzureDevOpsBugFilingService.isHidden).toBeUndefined();
    });

    it('buildStoreData', () => {
        const expectedStoreData: AzureDevOpsBugFilingSettings = {
            project: projectStub,
            issueDetailsLocation: issueDetailsLocationStub,
        };
        expect(AzureDevOpsBugFilingService.buildStoreData(projectStub, issueDetailsLocationStub)).toEqual(expectedStoreData);
    });

    it('getSettingsFromStoreData', () => {
        const expectedStoreData: AzureDevOpsBugFilingSettings = {
            project: projectStub,
            issueDetailsLocation: issueDetailsLocationStub,
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
            project: 'some project',
            issueDetailsLocation: 'some issue details location',
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
            expect(AzureDevOpsBugFilingService.createBugFilingUrl(settings, null)).toBeNull();
        });
    });
});
