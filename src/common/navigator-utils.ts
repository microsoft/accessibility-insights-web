// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Logger } from 'common/logging/logger';

export class NavigatorUtils {
    constructor(
        private navigatorInfo: Navigator,
        private logger: Logger,
    ) {}

    public getBrowserSpec(): string {
        const userAgent = this.navigatorInfo.userAgent;

        const edgVersion = this.getVersion(userAgent, 'Edg');
        if (edgVersion !== null) {
            return `Microsoft Edge version ${edgVersion}`;
        }

        const chromeVersion = this.getVersion(userAgent, 'Chrome');
        if (chromeVersion !== null) {
            return `Chrome version ${chromeVersion}`;
        }

        return userAgent;
    }

    private getVersion(userAgent: string, versionPrefix: string): string | null {
        const versionOffset = userAgent.indexOf(versionPrefix);
        if (versionOffset === -1) {
            return null;
        }

        return userAgent.substring(versionOffset + versionPrefix.length + 1).split(' ')[0];
    }

    public copyToClipboard(data: string): Promise<void> {
        return this.navigatorInfo.clipboard.writeText(data).catch(error => {
            this.logger.error(`Error during copyToClipboard: ${error}`, error);
            throw error;
        });
    }
}
