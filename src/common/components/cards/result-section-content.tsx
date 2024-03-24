// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardsVisualizationModifierButtons } from 'common/components/cards/cards-visualization-modifier-buttons';
import { HeadingLevel } from 'common/components/heading-element-for-level';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { NamedFC } from 'common/react/named-fc';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import * as React from 'react';
import { OutcomeCounter } from 'reports/components/outcome-counter';

import { TargetAppData } from '../../../common/types/store-data/unified-data-interface';
import { InstanceOutcomeType } from '../../../reports/components/instance-outcome-type';
import { NoFailedInstancesCongratsDeps } from '../../../reports/components/report-sections/no-failed-instances-congrats';
import { CardRuleResult } from '../../types/store-data/card-view-model';
import { UserConfigurationStoreData } from '../../types/store-data/user-configuration-store';
import { RulesWithInstances, RulesWithInstancesDeps } from './rules-with-instances';

export type ResultSectionContentDeps = RulesWithInstancesDeps &
    NoFailedInstancesCongratsDeps & {
        cardsVisualizationModifierButtons: CardsVisualizationModifierButtons;
        getNextHeadingLevel: (headingLevel: HeadingLevel) => HeadingLevel;
    };

export type ResultSectionContentProps = {
    deps: ResultSectionContentDeps;
    results: CardRuleResult[];
    outcomeType: InstanceOutcomeType;
    userConfigurationStoreData: UserConfigurationStoreData | null;
    targetAppInfo: TargetAppData;
    visualHelperEnabled: boolean;
    allCardsCollapsed: boolean;
    outcomeCounter: OutcomeCounter;
    headingLevel: number;
    cardSelectionMessageCreator?: CardSelectionMessageCreator;
    narrowModeStatus?: NarrowModeStatus;
};

export const ResultSectionContent = NamedFC<ResultSectionContentProps>(
    'ResultSectionContent',
    props => {
        const {
            results,
            outcomeType,
            deps,
            userConfigurationStoreData,
            targetAppInfo,
            outcomeCounter,
            headingLevel,
            cardSelectionMessageCreator,
            narrowModeStatus,
        } = props;
        if (results.length === 0) {
            return null;
        }
        return (
            <>
                {cardSelectionMessageCreator !== undefined && (
                    <deps.cardsVisualizationModifierButtons
                        {...props}
                        cardSelectionMessageCreator={cardSelectionMessageCreator!}
                    />
                )}
                <RulesWithInstances
                    deps={deps}
                    rules={results}
                    outcomeType={outcomeType}
                    userConfigurationStoreData={userConfigurationStoreData}
                    targetAppInfo={targetAppInfo}
                    outcomeCounter={outcomeCounter}
                    headingLevel={headingLevel}
                    cardSelectionMessageCreator={cardSelectionMessageCreator}
                    narrowModeStatus={narrowModeStatus}
                />
            </>
        );
    },
);
