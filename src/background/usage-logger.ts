// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { StorageAdapter } from '../common/browser-adapters/storage-adapter';
import { Logger } from '../common/logging/logger';

export const USAGE_KEY: string = 'ADA_IS_A_COOL_CAT';

export class UsageLogger {
    constructor(
        private storageAdapter: StorageAdapter,
        private dateGetter: () => Date,
        private logger: Logger,
    ) {}

    public record(): void {
        this.storageAdapter
            .setUserData({
                usageData: {
                    lastUsageDateTime: this.dateGetter().toISOString(),
                    usageKey: USAGE_KEY,
                },
            })
            .catch(this.logger.error);
    }
}
