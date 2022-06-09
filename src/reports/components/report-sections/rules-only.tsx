// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import styles from 'common/components/cards/rules-with-instances.scss';
import { NamedFC } from 'common/react/named-fc';
import { CardRuleResult } from 'common/types/store-data/card-view-model';
import * as React from 'react';
import { InstanceOutcomeType } from '../instance-outcome-type';
import { FullRuleHeader, FullRuleHeaderDeps } from './full-rule-header';

export type RulesOnlyDeps = FullRuleHeaderDeps;

export type RulesOnlyProps = {
    deps: RulesOnlyDeps;
    cardRuleResults: CardRuleResult[];
    outcomeType: InstanceOutcomeType;
};

export const RulesOnly = NamedFC<RulesOnlyProps>(
    'RulesOnly',
    ({ outcomeType, deps, cardRuleResults: cardResults }) => {
        return (
            <div className={styles.ruleDetailsGroup}>
                {cardResults.map(cardRuleResult => (
                    <FullRuleHeader
                        deps={deps}
                        key={cardRuleResult.id}
                        cardRuleResult={cardRuleResult}
                        outcomeType={outcomeType}
                    />
                ))}
            </div>
        );
    },
);
