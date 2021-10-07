// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardResult } from 'common/types/store-data/card-view-model';

// Licensed under the MIT License.
export type OutcomeCounter = (cards: CardResult[]) => number;

const countByCards: OutcomeCounter = cards => cards.length;

const countByIdentifierUrls: OutcomeCounter = cards =>
    cards.reduce((total, card) => {
        if (!card.identifiers.urls?.urlInfos) return total;

        return total + card.identifiers.urls.urlInfos.length;
    }, 0);

export const OutcomeCounter = {
    countByCards,
    countByIdentifierUrls,
};
