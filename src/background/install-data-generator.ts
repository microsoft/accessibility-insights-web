// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { StorageAdapter } from 'common/browser-adapters/storage-adapter';
import { InstallationData } from './installation-data';
import { LocalStorageDataKeys } from './local-storage-data-keys';

export class InstallDataGenerator {
    private installationData: InstallationData;

    constructor(
        readonly initialInstallationData: InstallationData,
        private readonly generateGuid: () => string,
        private readonly dateGetter: () => Date,
        private readonly storageAdapter: StorageAdapter,
    ) {
        this.installationData = initialInstallationData;
    }

    public getInstallationId(): string {
        const currentDate = this.dateGetter();

        if (this.installationData == null || this.isInstallationDataStale(currentDate)) {
            return this.generateInstallationData(currentDate);
        } else {
            return this.installationData.id;
        }
    }

    private isInstallationDataStale(currentDate: Date): boolean {
        const currentMonth = currentDate.getUTCMonth();
        const currentYear = currentDate.getUTCFullYear();

        return currentMonth !== this.installationData.month || currentYear !== this.installationData.year;
    }

    private generateInstallationData(currentDate: Date): string {
        this.installationData = {
            id: this.generateGuid(),
            month: currentDate.getUTCMonth(),
            year: currentDate.getUTCFullYear(),
        };

        this.storageAdapter.setUserData({ [LocalStorageDataKeys.installationData]: this.installationData }).catch(console.error);
        return this.installationData.id;
    }
}
