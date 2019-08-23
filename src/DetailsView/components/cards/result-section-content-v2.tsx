// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedSFC } from 'common/react/named-sfc';
import { FixInstructionProcessor } from 'injected/fix-instruction-processor';
import * as React from 'react';

import { InstanceOutcomeType } from '../../../reports/components/instance-outcome-type';
import { NoFailedInstancesCongrats } from '../../../reports/components/report-sections/no-failed-instances-congrats';
import { RulesWithInstancesDeps } from '../../../reports/components/report-sections/rules-with-instances';
import { UnifiedRuleResult } from './failed-instances-section-v2';
import { RulesWithInstancesV2 } from './rules-with-instances-v2';

export type ResultSectionContentV2Deps = RulesWithInstancesDeps;

export type ResultSectionContentV2Props = {
    deps: ResultSectionContentV2Deps;
    unifiedResults: UnifiedRuleResult[];
    outcomeType: InstanceOutcomeType;
    fixInstructionProcessor?: FixInstructionProcessor;
};

export const ResultSectionContentV2 = NamedSFC<ResultSectionContentV2Props>(
    'ResultSectionContentV2',
    ({ unifiedResults, outcomeType, fixInstructionProcessor, deps }) => {
        if (unifiedResults.length === 0) {
            return <NoFailedInstancesCongrats />;
        }

        const rules = [];
        return (
            <RulesWithInstancesV2 deps={deps} rules={rules} outcomeType={outcomeType} fixInstructionProcessor={fixInstructionProcessor} />
        );
    },
);
