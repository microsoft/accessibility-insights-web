// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import * as React from 'react';

import { UserConfigMessageCreator } from '../../common/message-creators/user-config-message-creator';
import { NamedSFC } from '../../common/react/named-sfc';
import { UserConfigurationStoreData } from '../../common/types/store-data/user-configuration-store';
import { BugFilingOptionProvider } from '../bug-filing-option-provider';

export type BugFilingChoiceGroupProps = {
    deps: BugFilingChoiceGroupDeps;
    userConfigurationStoreData: UserConfigurationStoreData;
};

export type BugFilingChoiceGroupDeps = {
    userConfigMessageCreator: UserConfigMessageCreator;
    bugFilingOptionProvider: BugFilingOptionProvider;
};

export const BugFilingChoiceGroup = NamedSFC<BugFilingChoiceGroupProps>('BugFilingChoiceGroup', props => {
    const { userConfigMessageCreator, bugFilingOptionProvider } = props.deps;

    const getOptions: () => IChoiceGroupOption[] = () => {
        return bugFilingOptionProvider.all().map(option => {
            return {
                key: option.key,
                text: option.displayName,
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
