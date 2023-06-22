// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FilterableResult } from 'common/get-card-selection-view-data';
import { PlatformData } from 'common/types/store-data/unified-data-interface';

export type IsResultHighlightUnavailable = (
    result: FilterableResult,
    platformInfo: PlatformData | null,
) => boolean;

export const isResultHighlightUnavailableWeb: IsResultHighlightUnavailable = () => false;
