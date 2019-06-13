// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { RuleResult } from '../../../../scanner/iruleresults';
import { NoFailedInstancesCongrats } from './no-failed-instances-congrats';
import { InstanceOutcomeType } from './outcome-summary-bar';
import { RuleDetailsGroup } from './rule-details-group';

export type ResultSectionContentProps = {
    rules: RuleResult[];
    outcomeType: InstanceOutcomeType;
    showDetails?: boolean;
    showCongratsIfNotInstances?: boolean;
};

export const ResultSectionContent = NamedSFC<ResultSectionContentProps>(
    'ResultSectionContent',
    ({ rules, showDetails, outcomeType, showCongratsIfNotInstances }) => {
        let content = <RuleDetailsGroup rules={rules} showDetails={showDetails} outcomeType={outcomeType} />;

        if (rules.length === 0 && showCongratsIfNotInstances) {
            content = <NoFailedInstancesCongrats />;
        }

        return content;
    },
);
