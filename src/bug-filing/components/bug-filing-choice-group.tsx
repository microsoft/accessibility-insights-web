// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import * as React from 'react';

import { UserConfigMessageCreator } from '../../common/message-creators/user-config-message-creator';
import { NamedSFC } from '../../common/react/named-sfc';
import { UserConfigurationStoreData } from '../../common/types/store-data/user-configuration-store';
import { BugFilingServiceProvider } from '../bug-filing-service-provider';

export type BugFilingChoiceGroupProps = {
    deps: BugFilingChoiceGroupDeps;
    userConfigurationStoreData: UserConfigurationStoreData;
};

export type BugFilingChoiceGroupDeps = {
    userConfigMessageCreator: UserConfigMessageCreator;
    bugFilingServiceProvider: BugFilingServiceProvider;
};

export const BugFilingChoiceGroup = NamedSFC<BugFilingChoiceGroupProps>('BugFilingChoiceGroup', props => {
    const { userConfigMessageCreator, bugFilingServiceProvider } = props.deps;

    const getOptions: () => IChoiceGroupOption[] = () => {
        return bugFilingServiceProvider.all().map(service => {
            return {
                key: service.key,
                text: service.displayName,
            };
        });
    };

    const onChange = (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, option?: IChoiceGroupOption) => {
        userConfigMessageCreator.setBugService(option.key);
    };

    return (
        <ChoiceGroup
            className={'bug-filing-choice-group'}
            onChange={onChange}
            options={getOptions()}
            selectedKey={props.userConfigurationStoreData.bugService}
        />
    );
});
