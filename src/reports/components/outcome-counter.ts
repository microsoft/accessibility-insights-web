// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardResult } from 'common/types/store-data/card-view-model';
import { getCardResultUrlCount } from 'reports/components/card-result-url-counter';

// Licensed under the MIT License.
export type OutcomeCounter = (cards: CardResult[]) => number;

const countByCards: OutcomeCounter = cards => cards.length;

const countByIdentifierUrls: OutcomeCounter = cards =>
    cards.reduce((total, card) => {
        const failedUrlCount = getCardResultUrlCount(card);

        if (failedUrlCount === 0) return total;

        return total + failedUrlCount;
    }, 0);

export const OutcomeCounter = {
    countByCards,
    countByIdentifierUrls,
};
