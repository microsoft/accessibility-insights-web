// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { CardRuleResult } from 'common/types/store-data/card-view-model';
import * as React from 'react';

import { InstanceOutcomeType } from '../instance-outcome-type';
import { FullRuleHeader, FullRuleHeaderDeps } from './full-rule-header';

export type RulesOnlyDeps = FullRuleHeaderDeps;

export type RulesOnlyProps = {
    deps: RulesOnlyDeps;
    cardResults: CardRuleResult[];
    outcomeType: InstanceOutcomeType;
};

export const RulesOnly = NamedFC<RulesOnlyProps>('RulesOnly', ({ outcomeType, deps, cardResults }) => {
    return (
        <div className="rule-details-group">
            {cardResults.map(cardResult => (
                <FullRuleHeader deps={deps} key={cardResult.id} cardResult={cardResult} outcomeType={outcomeType} />
            ))}
        </div>
    );
});
