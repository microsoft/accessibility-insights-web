// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CardResult } from 'common/types/store-data/card-view-model';

export const getCardResultUrlCount = (cardResult: CardResult) => {
    const urls = cardResult.identifiers.urls?.urls;
    const baselineAwareUrls = cardResult.identifiers.urls?.baselineAwareUrls;

    if (baselineAwareUrls) {
        return baselineAwareUrls.length;
    }

    if (urls) {
        return urls.length;
    }

    return 0;
};
