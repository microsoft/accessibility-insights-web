// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { issueFilingTitleId } from 'DetailsView/components/details-view-overlay/settings-panel/settings/issue-filing/issue-filing-settings';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react';
import * as React from 'react';

import { NamedFC } from '../../common/react/named-fc';
import { IssueFilingService } from '../types/issue-filing-service';
import { OnSelectedServiceChange } from './issue-filing-settings-container';

export type IssueFilingChoiceGroupProps = {
    selectedIssueFilingService: IssueFilingService;
    issueFilingServices: IssueFilingService[];
    onSelectedServiceChange: OnSelectedServiceChange;
};

export const IssueFilingChoiceGroup = NamedFC<IssueFilingChoiceGroupProps>(
    'IssueFilingChoiceGroup',
    props => {
        const getOptions: () => IChoiceGroupOption[] = () => {
            return props.issueFilingServices.map(service => {
                return {
                    key: service.key,
                    text: service.displayName,
                };
            });
        };

        const onChange = (
            ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
            option?: IChoiceGroupOption,
        ) => {
            const payload = {
                issueFilingServiceName: option?.key ?? 'none',
            };
            props.onSelectedServiceChange(payload);
        };

        return (
            <ChoiceGroup
                className={'issue-filing-choice-group'}
                ariaLabelledBy={issueFilingTitleId}
                onChange={onChange}
                options={getOptions()}
                selectedKey={props.selectedIssueFilingService.key}
            />
        );
    },
);
