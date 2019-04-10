// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import * as React from 'react';

import { UserConfigMessageCreator } from '../../common/message-creators/user-config-message-creator';
import { NamedSFC } from '../../common/react/named-sfc';
import { BugFilingService } from '../types/bug-filing-service';

export type BugFilingChoiceGroupProps = {
    deps: BugFilingChoiceGroupDeps;
    selectedBugFilingService: BugFilingService;
    bugFilingServices: BugFilingService[];
};

export type BugFilingChoiceGroupDeps = {
    userConfigMessageCreator: UserConfigMessageCreator;
};

export const BugFilingChoiceGroup = NamedSFC<BugFilingChoiceGroupProps>('BugFilingChoiceGroup', props => {
    const { userConfigMessageCreator } = props.deps;

    const getOptions: () => IChoiceGroupOption[] = () => {
        return props.bugFilingServices.map(service => {
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
            selectedKey={props.selectedBugFilingService.key}
        />
    );
});
