// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { StorageAPI } from './browser-adapters/storage-adapter';
import { InstallationData } from './installation-data';
import { LocalStorageDataKeys } from './local-storage-data-keys';

export class InstallDataGenerator {
    private generateGuid: () => string;
    private dateGetter: () => Date;
    private installationData: InstallationData;

    constructor(
        initialInstallationData: InstallationData,
        generateGuid: () => string,
        dateGetter: () => Date,
        private readonly storageAdapter: StorageAPI,
    ) {
        this.generateGuid = generateGuid;
        this.dateGetter = dateGetter;
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

        this.storageAdapter.setUserData({ [LocalStorageDataKeys.installationData]: this.installationData });
        return this.installationData.id;
    }
}
