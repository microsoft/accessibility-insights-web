// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    HighlightHiddenIcon,
    HighlightUnavailableIcon,
    HighlightVisibleIcon,
} from 'common/icons/highlight-status-icons';
import { NamedFC } from 'common/react/named-fc';
import { CreateIssueDetailsTextData } from 'common/types/create-issue-details-text-data';
import { CardResult } from 'common/types/store-data/card-view-model';
import { TargetAppData, UnifiedRule } from 'common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { UnifiedResultToIssueFilingDataConverter } from 'issue-filing/unified-result-to-issue-filing-data';
import { Label } from 'office-ui-fabric-react';
import * as React from 'react';

import { CardInteractionSupport } from './card-interaction-support';
import { CardKebabMenuButton, CardKebabMenuButtonDeps } from './card-kebab-menu-button';
import * as styles from './instance-details-footer.scss';

export type HighlightState = 'visible' | 'hidden' | 'unavailable';

export type InstanceDetailsFooterDeps = {
    cardInteractionSupport: CardInteractionSupport;
    unifiedResultToIssueFilingDataConverter: UnifiedResultToIssueFilingDataConverter;
} & CardKebabMenuButtonDeps;

export type InstanceDetailsFooterProps = {
    deps: InstanceDetailsFooterDeps;
    result: CardResult;
    userConfigurationStoreData: UserConfigurationStoreData;
    targetAppInfo: TargetAppData;
    rule: UnifiedRule;
};

export const InstanceDetailsFooter = NamedFC<InstanceDetailsFooterProps>(
    'InstanceDetailsFooter',
    props => {
        const { deps, userConfigurationStoreData, result, rule, targetAppInfo } = props;
        const { cardInteractionSupport } = deps;

        const supportsAnyActions =
            cardInteractionSupport.supportsIssueFiling ||
            cardInteractionSupport.supportsCopyFailureDetails;
        const { supportsHighlighting } = cardInteractionSupport;

        if (!supportsHighlighting && !supportsAnyActions) {
            return null;
        }

        const renderKebabMenu = () => {
            if (!supportsAnyActions) {
                return null;
            }

            const issueDetailsData: CreateIssueDetailsTextData =
                deps.unifiedResultToIssueFilingDataConverter.convert(result, rule, targetAppInfo);

            const kebabMenuAriaLabel: string = `More Actions for failure instance ${result.identifiers.identifier} in rule ${rule.id}`;
            return (
                <CardKebabMenuButton
                    deps={deps}
                    userConfigurationStoreData={userConfigurationStoreData}
                    issueDetailsData={issueDetailsData}
                    kebabMenuAriaLabel={kebabMenuAriaLabel}
                />
            );
        };

        const renderHighlightStatus = () => {
            if (!supportsHighlighting) {
                return null;
            }

            const highlightState = result.highlightStatus;

            const label = 'Highlight ' + highlightState;
            const icon = {
                unavailable: <HighlightUnavailableIcon />,
                visible: <HighlightVisibleIcon />,
                hidden: <HighlightHiddenIcon />,
            }[highlightState];

            return (
                <div className={styles.highlightStatus}>
                    {icon}
                    <Label>{label}</Label>
                </div>
            );
        };

        return (
            <div className={styles.foot}>
                {renderHighlightStatus()}
                {renderKebabMenu()}
            </div>
        );
    },
);
