// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { some, values } from 'lodash';
import { Label } from 'office-ui-fabric-react';
import * as React from 'react';

import { HighlightHiddenIcon, HighlightUnavailableIcon, HighlightVisibleIcon } from 'common/icons/highlight-status-icons';
import { TargetAppData, UnifiedResult, UnifiedRule } from '../../../common/types/store-data/unified-data-interface';
import { UnifiedResultToIssueFilingDataConverter } from '../../../issue-filing/unified-result-to-issue-filing-data';
import { CreateIssueDetailsTextData } from '../../types/create-issue-details-text-data';
import { UserConfigurationStoreData } from '../../types/store-data/user-configuration-store';
import { CardInteractionSupport } from './card-interaction-support';
import { CardKebabMenuButton, CardKebabMenuButtonDeps } from './card-kebab-menu-button';
import { foot, highlightStatus } from './instance-details-footer.scss';

export type HighlightState = 'visible' | 'hidden' | 'unavailable';

export type InstanceDetailsFooterDeps = {
    cardInteractionSupport: CardInteractionSupport;
    unifiedResultToIssueFilingDataConverter: UnifiedResultToIssueFilingDataConverter;
} & CardKebabMenuButtonDeps;

export type InstanceDetailsFooterProps = {
    deps: InstanceDetailsFooterDeps;
    result: UnifiedResult;
    highlightState: HighlightState;
    userConfigurationStoreData: UserConfigurationStoreData;
    targetAppInfo: TargetAppData;
    rule: UnifiedRule;
};

export const InstanceDetailsFooter = NamedFC<InstanceDetailsFooterProps>('InstanceDetailsFooter', props => {
    const { highlightState, deps, userConfigurationStoreData, result, rule, targetAppInfo } = props;
    const { cardInteractionSupport } = deps;

    const anyInteractionSupport = some(values(cardInteractionSupport));
    if (!anyInteractionSupport) {
        return null;
    }

    const issueDetailsData: CreateIssueDetailsTextData = deps.unifiedResultToIssueFilingDataConverter.convert(result, rule, targetAppInfo);

    const renderKebabMenu = () => {
        return (
            <CardKebabMenuButton deps={deps} userConfigurationStoreData={userConfigurationStoreData} issueDetailsData={issueDetailsData} />
        );
    };

    const renderHighlightStatus = () => {
        const label = 'Highlight ' + highlightState;
        const icon = {
            unavailable: <HighlightUnavailableIcon />,
            visible: <HighlightVisibleIcon />,
            hidden: <HighlightHiddenIcon />,
        }[highlightState];

        return (
            <div className={highlightStatus}>
                {icon}
                <Label>{label}</Label>
            </div>
        );
    };

    return (
        <div className={foot}>
            {renderHighlightStatus()}
            {renderKebabMenu()}
        </div>
    );
});
