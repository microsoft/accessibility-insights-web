// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export class NavigatorUtils {
    private navigatorInfo: Navigator;
    constructor(navigatorInfo: Navigator) {
        this.navigatorInfo = navigatorInfo;
    }

    public getBrowserSpec(): string {
        const userAgent = this.navigatorInfo.userAgent;

        const edgeVersion = this.getVersion(userAgent, 'Edg');
        if (edgeVersion !== null) {
            return `Edge version ${edgeVersion}`;
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
}
