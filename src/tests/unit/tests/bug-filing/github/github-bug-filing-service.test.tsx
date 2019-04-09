// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GithubBugFilingService, GithubBugFilingSettings } from '../../../../../bug-filing/github/github-bug-filing-service';
import { Mock, IMock, Times } from 'typemoq';
import { UserConfigMessageCreator } from '../../../../../common/message-creators/user-config-message-creator';
import { SettingsFormProps } from '../../../../../bug-filing/types/settings-form-props';
import { shallow } from 'enzyme';
import * as React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';

describe('GithubBugFilingServiceTest', () => {
    let userConfigMessageCreatorMock: IMock<UserConfigMessageCreator>;
    let props: SettingsFormProps<GithubBugFilingSettings>;
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

    test('static properties', () => {
        expect(GithubBugFilingService.key).toBe('github');
        expect(GithubBugFilingService.displayName).toBe('Github');
    });

    test('buildStoreData', () => {
        const url = 'base';
        const expectedStoreData: GithubBugFilingSettings = {
            repository: url,
        };
        expect(GithubBugFilingService.buildStoreData(url)).toEqual(expectedStoreData);
    });

    test('isSettingsValid', () => {
        const emptySettings: GithubBugFilingSettings = null;
        const invalidSettings: GithubBugFilingSettings = {
            repository: '  ',
        };
        const validSettings: GithubBugFilingSettings = {
            repository: 'repository',
        };
        expect(GithubBugFilingService.isSettingsValid(emptySettings)).toBe(false);
        expect(GithubBugFilingService.isSettingsValid(invalidSettings)).toBe(false);
        expect(GithubBugFilingService.isSettingsValid(validSettings)).toBe(true);
    });

    test('renderSettingsForm', () => {
        const Component = GithubBugFilingService.renderSettingsForm;
        const wrapper = shallow(<Component {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('renderSettingsForm: onChange', () => {
        const Component = GithubBugFilingService.renderSettingsForm;
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

    test('fileBug', () => {
        expect(GithubBugFilingService.fileBug).not.toBeNull();
    });
});
