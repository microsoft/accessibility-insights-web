// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../common/react/named-sfc';
import { FailedInstancesSectionV2, FailedInstancesSectionV2Deps, UnifiedStatusResults } from './cards/failed-instances-section-v2';

export type CardsViewDeps = FailedInstancesSectionV2Deps;

export interface CardsViewProps {
    deps: CardsViewDeps;
    ruleResultsByStatus: UnifiedStatusResults;
}

export const CardsView = NamedSFC<CardsViewProps>('CardsView', props => {
    return (
        <>
            <FailedInstancesSectionV2 deps={props.deps} ruleResultsByStatus={props.ruleResultsByStatus} />
        </>
    );
});
