// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import { OnPropertyUpdateCallback } from '../../../../../issue-filing/components/issue-filing-settings-container';
import { gitHubIssueFilingUrlProvider } from '../../../../../issue-filing/github/create-github-issue-filing-url';
import { GitHubBugFilingService, GitHubBugFilingSettings } from '../../../../../issue-filing/github/github-issue-filing-service';
import { SettingsFormProps } from '../../../../../issue-filing/types/settings-form-props';
import { BugServicePropertiesMap } from '../../../../../common/types/store-data/user-configuration-store';
import { SettingsDeps } from '../../../../../DetailsView/components/settings-panel/settings/settings-props';

describe('GithubBugFilingServiceTest', () => {
    let props: SettingsFormProps<GitHubBugFilingSettings>;
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
        expect(GitHubBugFilingService.key).toBe('gitHub');
        expect(GitHubBugFilingService.displayName).toBe('GitHub');
        expect(GitHubBugFilingService.isHidden).toBeUndefined();
    });

    it('buildStoreData', () => {
        const url = 'base';
        const expectedStoreData: GitHubBugFilingSettings = {
            repository: url,
        };
        expect(GitHubBugFilingService.buildStoreData(url)).toEqual(expectedStoreData);
    });

    it('getSettingsFromStoreData', () => {
        const expectedStoreData: GitHubBugFilingSettings = {
            repository: 'some url',
        };
        const givenData: BugServicePropertiesMap = {
            'some other service': {},
            [GitHubBugFilingService.key]: expectedStoreData,
        };
        expect(GitHubBugFilingService.getSettingsFromStoreData(givenData)).toEqual(expectedStoreData);
    });

    describe('check for invalid settings', () => {
        it.each(invalidTestSettings)('with %o', settings => {
            expect(GitHubBugFilingService.isSettingsValid(settings)).toBe(false);
        });
    });

    it('isSettingsValid - valid case', () => {
        const validSettings: GitHubBugFilingSettings = {
            repository: 'repository',
        };

        expect(GitHubBugFilingService.isSettingsValid(validSettings)).toBe(true);
    });

    it('renderSettingsForm', () => {
        const Component = GitHubBugFilingService.settingsForm;
        const wrapper = shallow(<Component {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renderSettingsForm: no valid settings object', () => {
        const Component = GitHubBugFilingService.settingsForm;
        props.settings = null;
        const wrapper = shallow(<Component {...props} />);
        const textField = wrapper.find(TextField);
        expect(textField.exists()).toBe(true);
        expect(textField.props().value).toEqual('');
    });

    it('renderSettingsForm: onChange', () => {
        const Component = GitHubBugFilingService.settingsForm;
        const wrapper = shallow(<Component {...props} />);
        onPropertyUpdateCallbackMock.setup(mock => mock('gitHub', 'repository', 'new value')).verifiable(Times.once());
        wrapper
            .find(TextField)
            .props()
            .onChange(null, 'new value');
        onPropertyUpdateCallbackMock.verifyAll();
    });

    describe('create bug filing url', () => {
        expect(GitHubBugFilingService.issueFilingUrlProvider).toEqual(gitHubIssueFilingUrlProvider);
    });
});
