// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardSelectionStore } from 'background/stores/card-selection-store';
import { FailedInstancesSection, FailedInstancesSectionDeps, UnifiedStatusResults } from 'common/components/cards/failed-instances-section';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

export type CardsViewDeps = {
    cardSelectionStore: CardSelectionStore;
} & FailedInstancesSectionDeps;

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
