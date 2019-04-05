// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import { BugFilingOptionProvider } from '../../../../../bug-filing/bug-filing-option-provider';
import { BugFilingChoiceGroup, BugFilingChoiceGroupProps } from '../../../../../bug-filing/components/bug-filing-choice-group';
import { UserConfigMessageCreator } from '../../../../../common/message-creators/user-config-message-creator';
import { UserConfigurationStoreData } from '../../../../../common/types/store-data/user-configuration-store';
import { BugFilingOption } from '../../../../../bug-filing/types/bug-filing-option';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';

describe('BugFilingChoiceGroupTest', () => {
    let userConfigMessageCreatorMock: IMock<UserConfigMessageCreator>;
    let bugFilingOptionProviderMock: IMock<BugFilingOptionProvider>;
    const testKey = 'test bug service key';
    const testName = 'test bug service name';
    const testOption: IChoiceGroupOption = {
        key: testKey,
        text: testName,
    };

    beforeEach(() => {
        userConfigMessageCreatorMock = Mock.ofType(UserConfigMessageCreator);
        bugFilingOptionProviderMock = Mock.ofType(BugFilingOptionProvider);

        bugFilingOptionProviderMock
            .setup(b => b.all())
            .returns(() => {
                return [
                    {
                        key: testKey,
                        displayName: testName,
                    } as BugFilingOption,
                ];
            });
    });

    test('render', () => {
        const props: BugFilingChoiceGroupProps = {
            deps: {
                userConfigMessageCreator: userConfigMessageCreatorMock.object,
                bugFilingOptionProvider: bugFilingOptionProviderMock.object,
            },
            userConfigurationStoreData: {
                bugService: 'MyBugService',
            } as UserConfigurationStoreData,
        };

        const wrapper = shallow(<BugFilingChoiceGroup {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('onChange', () => {
        const props: BugFilingChoiceGroupProps = {
            deps: {
                userConfigMessageCreator: userConfigMessageCreatorMock.object,
                bugFilingOptionProvider: bugFilingOptionProviderMock.object,
            },
            userConfigurationStoreData: {
                bugService: 'MyBugService',
            } as UserConfigurationStoreData,
        };

        userConfigMessageCreatorMock.setup(u => u.setBugService(testOption.key)).verifiable(Times.once());

        const wrapper = shallow(<BugFilingChoiceGroup {...props} />);
        wrapper
            .find(ChoiceGroup)
            .props()
            .onChange(null, testOption);
        userConfigMessageCreatorMock.verifyAll();
    });
});
