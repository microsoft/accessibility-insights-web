// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { NamedFC } from 'common/react/named-fc';
import { FixInstructionProcessor } from 'injected/fix-instruction-processor';
import { ActionButton, Toggle } from 'office-ui-fabric-react';
import * as React from 'react';

import { SupportedMouseEvent } from 'common/telemetry-data-factory';
import { visualHelper } from 'DetailsView/Styles/detailsview.scss';
import { TargetAppData } from '../../../common/types/store-data/unified-data-interface';
import { InstanceOutcomeType } from '../../../reports/components/instance-outcome-type';
import { NoFailedInstancesCongrats } from '../../../reports/components/report-sections/no-failed-instances-congrats';
import { CardRuleResult } from '../../types/store-data/card-view-model';
import { UserConfigurationStoreData } from '../../types/store-data/user-configuration-store';
import { RulesWithInstances, RulesWithInstancesDeps } from './rules-with-instances';

export type ResultSectionContentDeps = RulesWithInstancesDeps & {
    cardSelectionMessageCreator: CardSelectionMessageCreator;
};

export type ResultSectionContentProps = {
    deps: ResultSectionContentDeps;
    results: CardRuleResult[];
    outcomeType: InstanceOutcomeType;
    fixInstructionProcessor?: FixInstructionProcessor;
    userConfigurationStoreData: UserConfigurationStoreData;
    targetAppInfo: TargetAppData;
    visualHelperEnabled: boolean;
    allCardsCollapsed: boolean;
};

export const ResultSectionContent = NamedFC<ResultSectionContentProps>(
    'ResultSectionContent',
    ({
        results,
        outcomeType,
        fixInstructionProcessor,
        deps,
        userConfigurationStoreData,
        targetAppInfo,
        allCardsCollapsed,
        visualHelperEnabled,
    }) => {
        if (results.length === 0) {
            return <NoFailedInstancesCongrats />;
        }

        let onClick: (_: SupportedMouseEvent) => void = deps.cardSelectionMessageCreator.collapseAllRules;
        let buttonText = 'Collapse all';

        if (allCardsCollapsed) {
            onClick = deps.cardSelectionMessageCreator.expandAllRules;
            buttonText = 'Expand all';
        }

        return (
            <>
                <ActionButton iconProps={{ iconName: 'Export' }} onClick={onClick}>
                    {buttonText}
                </ActionButton>
                <Toggle onClick={deps.cardSelectionMessageCreator.toggleVisualHelper} label="Visual helper" checked={visualHelperEnabled} />
                <RulesWithInstances
                    deps={deps}
                    rules={results}
                    outcomeType={outcomeType}
                    fixInstructionProcessor={fixInstructionProcessor}
                    userConfigurationStoreData={userConfigurationStoreData}
                    targetAppInfo={targetAppInfo}
                />
            </>
        );
    },
);
