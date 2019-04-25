// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import * as React from 'react';

import { NamedSFC } from '../../common/react/named-sfc';
import { BugFilingService } from '../types/issue-filing-service';
import { OnSelectedServiceChange } from './issue-filing-settings-container';

export type BugFilingChoiceGroupProps = {
    selectedBugFilingService: BugFilingService;
    bugFilingServices: BugFilingService[];
    onSelectedServiceChange: OnSelectedServiceChange;
};

export const BugFilingChoiceGroup = NamedSFC<BugFilingChoiceGroupProps>('BugFilingChoiceGroup', props => {
    const getOptions: () => IChoiceGroupOption[] = () => {
        return props.bugFilingServices.map(service => {
            return {
                key: service.key,
                text: service.displayName,
            };
        });
    };

    const onChange = (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, option?: IChoiceGroupOption) => {
        props.onSelectedServiceChange(option.key);
    };

    return (
        <ChoiceGroup
            className={'issue-filing-choice-group'}
            onChange={onChange}
            options={getOptions()}
            selectedKey={props.selectedBugFilingService.key}
        />
    );
});
