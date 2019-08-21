// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IAxeCheckResultFrameExtraData, RuleConfiguration } from '../iruleresults';

const frameTitleId: string = 'get-frame-title';

export const frameTitleConfiguration: RuleConfiguration = {
    checks: [
        {
            id: frameTitleId,
            evaluate: evaluateTitle,
        },
    ],
    rule: {
        id: frameTitleId,
        selector: 'frame, iframe',
        any: [frameTitleId],
        enabled: false,
    },
};

function evaluateTitle(node: HTMLElement, options: any): boolean {
    const frameTitle = node.title ? node.title.trim() : '';

    const frameResultData: IAxeCheckResultFrameExtraData = {
        frameType: node.tagName.toLowerCase(),
        frameTitle,
    };

    // tslint:disable-next-line:no-invalid-this
    this.data(frameResultData);

    return !!frameTitle;
}
