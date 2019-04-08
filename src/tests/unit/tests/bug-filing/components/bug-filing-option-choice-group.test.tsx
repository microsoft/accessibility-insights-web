// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import { BugFilingChoiceGroup, BugFilingChoiceGroupProps } from '../../../../../bug-filing/components/bug-filing-choice-group';
import { BugFilingService } from '../../../../../bug-filing/types/bug-filing-service';
import { UserConfigMessageCreator } from '../../../../../common/message-creators/user-config-message-creator';
import { UserConfigurationStoreData } from '../../../../../common/types/store-data/user-configuration-store';

describe('BugFilingChoiceGroupTest', () => {
    let userConfigMessageCreatorMock: IMock<UserConfigMessageCreator>;
    const testKey = 'test bug service key';
    const testName = 'test bug service name';
    const testOption: IChoiceGroupOption = {
        key: testKey,
        text: testName,
    };
    const services = [
        {
            key: testKey,
            displayName: testName,
        } as BugFilingService,
    ];

    beforeEach(() => {
        userConfigMessageCreatorMock = Mock.ofType(UserConfigMessageCreator);
    });

    test('render', () => {
        const props: BugFilingChoiceGroupProps = {
            deps: {
                userConfigMessageCreator: userConfigMessageCreatorMock.object,
            },
            userConfigurationStoreData: {
                bugService: 'MyBugService',
            } as UserConfigurationStoreData,
            bugFilingServices: services,
        };

        const wrapper = shallow(<BugFilingChoiceGroup {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('onChange', () => {
        const props: BugFilingChoiceGroupProps = {
            deps: {
                userConfigMessageCreator: userConfigMessageCreatorMock.object,
            },
            userConfigurationStoreData: {
                bugService: 'MyBugService',
            } as UserConfigurationStoreData,
            bugFilingServices: services,
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
