// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export class NavigatorUtils {
    private navigatorInfo: Navigator;
    constructor(navigatorInfo: Navigator) {
        this.navigatorInfo = navigatorInfo;
    }

    public getBrowserSpec(): string {
        const userAgent = this.navigatorInfo.userAgent;
        const versionOffset = userAgent.indexOf('Chrome');
        if (versionOffset === -1) {
            return userAgent;
        }
        const fullVersion = userAgent.substring(versionOffset + 7).split(' ')[0];

        return `Chrome version ${fullVersion}`;
    }
}
