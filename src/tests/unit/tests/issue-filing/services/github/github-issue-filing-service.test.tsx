// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import { IssueFilingServicePropertiesMap } from '../../../../../../common/types/store-data/user-configuration-store';
import { SettingsDeps } from '../../../../../../DetailsView/components/settings-panel/settings/settings-props';
import { OnPropertyUpdateCallback } from '../../../../../../issue-filing/components/issue-filing-settings-container';
import { gitHubIssueFilingUrlProvider } from '../../../../../../issue-filing/services/github/create-github-issue-filing-url';
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

    describe('check for invalid settings', () => {
        it.each(invalidTestSettings)('with %o', (settings: GitHubIssueFilingSettings) => {
            expect(GitHubIssueFilingService.isSettingsValid(settings)).toBe(false);
        });
    });

    it('isSettingsValid - valid case', () => {
        const validSettings: GitHubIssueFilingSettings = {
            repository: 'repository',
        };

        expect(GitHubIssueFilingService.isSettingsValid(validSettings)).toBe(true);
    });

    it('renderSettingsForm', () => {
        const Component = GitHubIssueFilingService.settingsForm;
        const wrapper = shallow(<Component {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renderSettingsForm: no valid settings object', () => {
        const Component = GitHubIssueFilingService.settingsForm;
        props.settings = null;
        const wrapper = shallow(<Component {...props} />);
        const textField = wrapper.find(TextField);
        expect(textField.exists()).toBe(true);
        expect(textField.props().value).toEqual('');
    });

    it('renderSettingsForm: onChange', () => {
        const Component = GitHubIssueFilingService.settingsForm;
        const wrapper = shallow(<Component {...props} />);
        onPropertyUpdateCallbackMock.setup(mock => mock('gitHub', 'repository', 'new value')).verifiable(Times.once());
        wrapper
            .find(TextField)
            .props()
            .onChange(null, 'new value');
        onPropertyUpdateCallbackMock.verifyAll();
    });

    describe('create bug filing url', () => {
        expect(GitHubIssueFilingService.issueFilingUrlProvider).toEqual(gitHubIssueFilingUrlProvider);
    });
});
