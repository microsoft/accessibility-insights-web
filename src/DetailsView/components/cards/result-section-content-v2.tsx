// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedSFC } from 'common/react/named-sfc';
import { FixInstructionProcessor } from 'injected/fix-instruction-processor';
import * as React from 'react';

import { InstanceOutcomeType } from '../../../reports/components/instance-outcome-type';
import { NoFailedInstancesCongrats } from '../../../reports/components/report-sections/no-failed-instances-congrats';
import { UnifiedRuleResult } from './failed-instances-section-v2';
import { RulesWithInstancesV2, RulesWithInstancesV2Deps } from './rules-with-instances-v2';

export type ResultSectionContentV2Deps = RulesWithInstancesV2Deps;

export type ResultSectionContentV2Props = {
    deps: ResultSectionContentV2Deps;
    results: UnifiedRuleResult[];
    outcomeType: InstanceOutcomeType;
    fixInstructionProcessor?: FixInstructionProcessor;
};

export const ResultSectionContentV2 = NamedSFC<ResultSectionContentV2Props>(
    'ResultSectionContentV2',
    ({ results, outcomeType, fixInstructionProcessor, deps }) => {
        if (results.length === 0) {
            return <NoFailedInstancesCongrats />;
        }

        return (
            <RulesWithInstancesV2 deps={deps} rules={results} outcomeType={outcomeType} fixInstructionProcessor={fixInstructionProcessor} />
        );
    },
);
