// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GetGuidanceTagsFromGuidanceLinks } from 'common/get-guidance-tags-from-guidance-links';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { NamedFC } from 'common/react/named-fc';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import * as React from 'react';
import {
    TargetAppData,
    UnifiedRule,
} from '../../../common/types/store-data/unified-data-interface';
import { CardRuleResult } from '../../types/store-data/card-view-model';
import { UserConfigurationStoreData } from '../../types/store-data/user-configuration-store';
import { InstanceDetails, InstanceDetailsDeps } from './instance-details';
import styles from './instance-details-group.scss';

export const ruleContentAutomationId = 'cards-rule-content';

export type InstanceDetailsGroupDeps = {
    getGuidanceTagsFromGuidanceLinks: GetGuidanceTagsFromGuidanceLinks;
} & InstanceDetailsDeps;

export type InstanceDetailsGroupProps = {
    deps: InstanceDetailsGroupDeps;
    rule: CardRuleResult;
    userConfigurationStoreData: UserConfigurationStoreData | null;
    targetAppInfo: TargetAppData;
    cardSelectionMessageCreator?: CardSelectionMessageCreator;
    narrowModeStatus?: NarrowModeStatus;
};

export const InstanceDetailsGroup = NamedFC<InstanceDetailsGroupProps>(
    'InstanceDetailsGroup',
    props => {
        const {
            deps,
            rule,
            userConfigurationStoreData,
            targetAppInfo,
            cardSelectionMessageCreator,
            narrowModeStatus,
        } = props;
        const { nodes } = rule;
        const unifiedRule: UnifiedRule = {
            id: rule.id,
            description: rule.description,
            url: rule.url,
            guidance: rule.guidance,
        };

        return (
            <ul
                data-automation-id={ruleContentAutomationId}
                className={styles.instanceDetailsList}
                aria-label="instances with additional information like path, snippet and how to fix"
            >
                {nodes.map((node, index) => (
                    <li key={`instance-details-${index}`}>
                        <InstanceDetails
                            {...{ index }}
                            deps={deps}
                            result={node}
                            userConfigurationStoreData={userConfigurationStoreData}
                            rule={unifiedRule}
                            targetAppInfo={targetAppInfo}
                            cardSelectionMessageCreator={cardSelectionMessageCreator}
                            narrowModeStatus={narrowModeStatus}
                        />
                    </li>
                ))}
            </ul>
        );
    },
);
