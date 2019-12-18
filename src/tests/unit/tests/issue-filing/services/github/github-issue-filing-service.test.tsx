// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { TextField } from 'office-ui-fabric-react';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';

import { IssueFilingServicePropertiesMap } from '../../../../../../common/types/store-data/user-configuration-store';
import { SettingsDeps } from '../../../../../../DetailsView/components/settings-panel/settings/settings-props';
import { OnPropertyUpdateCallback } from '../../../../../../issue-filing/components/issue-filing-settings-container';
import { GitHubIssueFilingService } from '../../../../../../issue-filing/services/github/github-issue-filing-service';
import { GitHubIssueFilingSettings } from '../../../../../../issue-filing/services/github/github-issue-filing-settings';
import { SettingsFormProps } from '../../../../../../issue-filing/types/settings-form-props';

describe('GithubIssueFilingServiceTest', () => {
    let props: SettingsFormProps<GitHubIssueFilingSettings>;
    let onPropertyUpdateCallbackMock: IMock<OnPropertyUpdateCallback>;

    const invalidTestSettings = [null, {}, undefined, { random: '' }, { repository: '' }];

    beforeEach(() => {
        onPropertyUpdateCallbackMock = Mock.ofInstance(() => null);
        props = {
            deps: {
                userConfigMessageCreator: null,
            } as SettingsDeps,
            settings: {
                repository: 'repo',
            },
            onPropertyUpdateCallback: onPropertyUpdateCallbackMock.object,
        };
    });

    it('static properties', () => {
        expect(GitHubIssueFilingService.key).toBe('gitHub');
        expect(GitHubIssueFilingService.displayName).toBe('GitHub');
        expect(GitHubIssueFilingService.isHidden).toBeUndefined();
    });

    it('buildStoreData', () => {
        const url = 'base';
        const expectedStoreData: GitHubIssueFilingSettings = {
            repository: url,
        };
        expect(GitHubIssueFilingService.buildStoreData(url)).toEqual(expectedStoreData);
    });

    it('getSettingsFromStoreData', () => {
        const expectedStoreData: GitHubIssueFilingSettings = {
            repository: 'some url',
        };
        const givenData: IssueFilingServicePropertiesMap = {
            'some other service': {},
            [GitHubIssueFilingService.key]: expectedStoreData,
        };
        expect(GitHubIssueFilingService.getSettingsFromStoreData(givenData)).toEqual(expectedStoreData);
    });

    describe('isSettingsValid', () => {
        it.each(invalidTestSettings)('invalid settings with %p', (settings: GitHubIssueFilingSettings) => {
            expect(GitHubIssueFilingService.isSettingsValid(settings)).toBe(false);
        });

        it('valid settings', () => {
            const validSettings: GitHubIssueFilingSettings = {
                repository: 'repository',
            };

            expect(GitHubIssueFilingService.isSettingsValid(validSettings)).toBe(true);
        });
    });

    describe('settingsForm', () => {
        it('renders', () => {
            const Component = GitHubIssueFilingService.settingsForm;
            const wrapper = shallow(<Component {...props} />);
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('renders with no valid settings object', () => {
            const Component = GitHubIssueFilingService.settingsForm;
            props.settings = null;
            const wrapper = shallow(<Component {...props} />);
            const textField = wrapper.find(TextField);
            expect(textField.exists()).toBe(true);
            expect(textField.props().value).toEqual('');
        });

        it('onChange', () => {
            const Component = GitHubIssueFilingService.settingsForm;
            const wrapper = shallow(<Component {...props} />);
            const newRepositoryValue = 'new repo';
            const payload = {
                issueFilingServiceName: GitHubIssueFilingService.key,
                propertyName: 'repository',
                propertyValue: newRepositoryValue,
            };
            onPropertyUpdateCallbackMock.setup(updateCallback => updateCallback(It.isValue(payload))).verifiable(Times.once());
            wrapper
                .find(TextField)
                .props()
                .onChange(null, newRepositoryValue);
            onPropertyUpdateCallbackMock.verifyAll();
        });
    });
});
