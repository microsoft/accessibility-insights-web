// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import { GitHubBugFilingService, GitHubBugFilingSettings } from '../../../../../bug-filing/github/github-bug-filing-service';
import { SettingsFormProps } from '../../../../../bug-filing/types/settings-form-props';
import { UserConfigMessageCreator } from '../../../../../common/message-creators/user-config-message-creator';
import { BugServicePropertiesMap } from '../../../../../common/types/store-data/user-configuration-store';

describe('GithubBugFilingServiceTest', () => {
    let userConfigMessageCreatorMock: IMock<UserConfigMessageCreator>;
    let props: SettingsFormProps<GitHubBugFilingSettings>;

    const invalidTestSettings = [null, {}, undefined, { random: '' }, { repository: '' }];

    beforeEach(() => {
        userConfigMessageCreatorMock = Mock.ofType(UserConfigMessageCreator);
        props = {
            deps: {
                userConfigMessageCreator: userConfigMessageCreatorMock.object,
            },
            settings: {
                repository: 'repo',
            },
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

    it('renderSettingsForm: onChange', () => {
        const Component = GitHubBugFilingService.settingsForm;
        const wrapper = shallow(<Component {...props} />);
        userConfigMessageCreatorMock
            .setup(ucmm => ucmm.setBugServiceProperty('gitHub', 'repository', 'new value'))
            .verifiable(Times.once());
        wrapper
            .find(TextField)
            .props()
            .onChange(null, 'new value');
        userConfigMessageCreatorMock.verifyAll();
    });

    describe('create bug filing url', () => {
        it.each(invalidTestSettings)('with %o', settings => {
            expect(GitHubBugFilingService.createBugFilingUrl(settings, null)).toBeNull();
        });
    });
});
