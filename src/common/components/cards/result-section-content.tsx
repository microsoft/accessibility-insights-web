// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardsVisualizationModifierButtonsProps } from 'common/components/cards/cards-visualization-modifier-buttons';
import { NamedFC, ReactFCWithDisplayName } from 'common/react/named-fc';
import { FixInstructionProcessor } from 'injected/fix-instruction-processor';
import * as React from 'react';

import { TargetAppData } from '../../../common/types/store-data/unified-data-interface';
import { InstanceOutcomeType } from '../../../reports/components/instance-outcome-type';
import { NoFailedInstancesCongrats } from '../../../reports/components/report-sections/no-failed-instances-congrats';
import { CardRuleResult } from '../../types/store-data/card-view-model';
import { UserConfigurationStoreData } from '../../types/store-data/user-configuration-store';
import { RulesWithInstances, RulesWithInstancesDeps } from './rules-with-instances';

export type ResultSectionContentDeps = RulesWithInstancesDeps & {
    cardsVisualizationModifierButtons: ReactFCWithDisplayName<CardsVisualizationModifierButtonsProps>;
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

export const ResultSectionContent = NamedFC<ResultSectionContentProps>('ResultSectionContent', props => {
    const { results, outcomeType, fixInstructionProcessor, deps, userConfigurationStoreData, targetAppInfo } = props;
    if (results.length === 0) {
        return <NoFailedInstancesCongrats />;
    }

    return (
        <>
            <deps.cardsVisualizationModifierButtons {...props} />
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
});
