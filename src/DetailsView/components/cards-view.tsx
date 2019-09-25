// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from '../../common/react/named-fc';
import { FailedInstancesSection, FailedInstancesSectionDeps, UnifiedStatusResults } from './cards/failed-instances-section-v2';

export type CardsViewDeps = FailedInstancesSectionDeps;

export interface CardsViewProps {
    deps: CardsViewDeps;
    ruleResultsByStatus: UnifiedStatusResults;
}

export const CardsView = NamedFC<CardsViewProps>('CardsView', props => {
    return (
        <>
            <FailedInstancesSection deps={props.deps} ruleResultsByStatus={props.ruleResultsByStatus} />
        </>
    );
});
