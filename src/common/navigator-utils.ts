// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export class NavigatorUtils {
    private navigatorInfo: Navigator;
    constructor(navigatorInfo: Navigator) {
        this.navigatorInfo = navigatorInfo;
    }

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

    private getVersion(userAgent: string, versionPrefix: string): string {
        const versionOffset = userAgent.indexOf(versionPrefix);
        if (versionOffset === -1) {
            return null;
        }

        return userAgent.substring(versionOffset + versionPrefix.length + 1).split(' ')[0];
    }

    public async copyToClipboard(data: string): Promise<void> {
        await this.navigatorInfo.clipboard.writeText(data);
    }
}
