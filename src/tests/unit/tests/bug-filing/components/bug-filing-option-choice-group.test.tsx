// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { BugFilingServiceProvider } from '../../../../../bug-filing/bug-filing-service-provider';
import { BugFilingChoiceGroup, BugFilingChoiceGroupProps } from '../../../../../bug-filing/components/bug-filing-choice-group';
import { BugFilingService } from '../../../../../bug-filing/types/bug-filing-service';
import { UserConfigMessageCreator } from '../../../../../common/message-creators/user-config-message-creator';
import { UserConfigurationStoreData } from '../../../../../common/types/store-data/user-configuration-store';

describe('BugFilingChoiceGroupTest', () => {
    let userConfigMessageCreatorMock: IMock<UserConfigMessageCreator>;
    let bugFilingServiceProviderMock: IMock<BugFilingServiceProvider>;
    const testKey = 'test bug service key';
    const testName = 'test bug service name';
    const testOption: IChoiceGroupOption = {
        key: testKey,
        text: testName,
    };

    beforeEach(() => {
        userConfigMessageCreatorMock = Mock.ofType(UserConfigMessageCreator);
        bugFilingServiceProviderMock = Mock.ofType(BugFilingServiceProvider);

        bugFilingServiceProviderMock
            .setup(b => b.all())
            .returns(() => {
                return [
                    {
                        key: testKey,
                        displayName: testName,
                    } as BugFilingService,
                ];
            });
    });

    test('render', () => {
        const props: BugFilingChoiceGroupProps = {
            deps: {
                userConfigMessageCreator: userConfigMessageCreatorMock.object,
                bugFilingServiceProvider: bugFilingServiceProviderMock.object,
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
                bugFilingServiceProvider: bugFilingServiceProviderMock.object,
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
