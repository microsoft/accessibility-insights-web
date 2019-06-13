// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { RuleResult } from '../../../../scanner/iruleresults';
import { CollapsibleContainer } from './collapsible-container';
import { InstanceDetailsGroup } from './instance-details-group';
import { InstanceOutcomeType } from './outcome-summary-bar';
import { RuleDetail, RuleDetailDeps } from './rule-detail';

export type RuleDetailsGroupDeps = RuleDetailDeps;

export type RuleDetailsGroupProps = {
    deps: RuleDetailsGroupDeps;
    rules: RuleResult[];
    outcomeType: InstanceOutcomeType;
    showDetails?: boolean;
};

export const RuleDetailsGroup = NamedSFC<RuleDetailsGroupProps>('RuleDetailsGroup', ({ rules, showDetails, outcomeType, deps }) => {
    return (
        <div className="rule-details-group">
            {rules.map((rule, idx) => {
                return showDetails ? (
                    <CollapsibleContainer
                        key={`summary-details-${idx + 1}`}
                        id={rule.id}
                        titleContainerProps={{ role: 'heading', 'aria-level': 3 }}
                        summaryContent={<RuleDetail deps={deps} key={rule.id} rule={rule} outcomeType={outcomeType} isHeader={false} />}
                        detailsContent={<InstanceDetailsGroup key={`${rule.id}-rule-group`} nodeResults={rule.nodes} />}
                        buttonAriaLabel="show failed instance list"
                        containerClassName="collapsible-rule-details-group"
                    />
                ) : (
                    <RuleDetail deps={deps} key={rule.id} rule={rule} outcomeType={outcomeType} isHeader={showDetails} />
                );
            })}
        </div>
    );
});
