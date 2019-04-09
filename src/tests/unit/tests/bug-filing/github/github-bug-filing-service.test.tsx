// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import { GitHubBugFilingService, GitHubBugFilingSettings } from '../../../../../bug-filing/github/github-bug-filing-service';
import { SettingsFormProps } from '../../../../../bug-filing/types/settings-form-props';
import { UserConfigMessageCreator } from '../../../../../common/message-creators/user-config-message-creator';

describe('GithubBugFilingServiceTest', () => {
    let userConfigMessageCreatorMock: IMock<UserConfigMessageCreator>;
    let props: SettingsFormProps<GitHubBugFilingSettings>;
    const nullSettings: GitHubBugFilingSettings = null;
    const emptySettings: GitHubBugFilingSettings = {} as GitHubBugFilingSettings;
    const invalidSettings1: GitHubBugFilingSettings = {
        random: ' ',
    } as any;
    const invalidSettings2: GitHubBugFilingSettings = {
        repository: '  ',
    };
    const invalidSettings3: GitHubBugFilingSettings = {
        repository: 3,
    } as any;
    const validSettings: GitHubBugFilingSettings = {
        repository: 'repository',
    };

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
    });

    it('buildStoreData', () => {
        const url = 'base';
        const expectedStoreData: GitHubBugFilingSettings = {
            repository: url,
        };
        expect(GitHubBugFilingService.buildStoreData(url)).toEqual(expectedStoreData);
    });

    it.each([nullSettings, emptySettings, invalidSettings1, invalidSettings2, invalidSettings3])(
        'isSettingsValid - invalid case',
        settings => {
            expect(GitHubBugFilingService.isSettingsValid(settings)).toBe(false);
        },
    );

    it('isSettingsValid - valid case', () => {
        expect(GitHubBugFilingService.isSettingsValid(validSettings)).toBe(true);
    });

    it('renderSettingsForm', () => {
        const Component = GitHubBugFilingService.renderSettingsForm;
        const wrapper = shallow(<Component {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renderSettingsForm: onChange', () => {
        const Component = GitHubBugFilingService.renderSettingsForm;
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

    it('createBugFilingUrl', () => {
        expect(GitHubBugFilingService.createBugFilingUrl).not.toBeNull();
    });
});
