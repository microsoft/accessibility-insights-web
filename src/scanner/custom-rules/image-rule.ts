// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as axe from 'axe-core';

import * as AxeUtils from '../axe-utils';
import { RuleConfiguration } from '../iruleresults';

export const imageConfiguration: RuleConfiguration = {
    checks: [
        {
            id: 'image-function-data-collector',
            evaluate: evaluateImageFunction,
        },
    ],
    rule: {
        id: 'image-function',
        selector: '*',
        any: ['image-function-data-collector'],
        all: [],
        matches: isImage,
        enabled: false,
    },
};

export function isImage(node: HTMLElement): boolean {
    const selector: string = 'img, [role=img], svg';
    if (axe.utils.matchesSelector(node, selector)) {
        return true;
    }
    if (node.tagName.toLowerCase() === 'i' && node.innerHTML === '') {
        return true;
    }
    if (AxeUtils.hasBackgoundImage(node)) {
        return true;
    }

    return false;
}

function evaluateImageFunction(node: HTMLElement): boolean {
    const accessibleName: string = AxeUtils.getAccessibleText(node);
    const codedAs: string | null = AxeUtils.getImageCodedAs(node);
    const imageType: string | null = AxeUtils.getImageType(node);
    const role: string | null = node.getAttribute('role');

    // tslint:disable-next-line:no-invalid-this
    this.data({
        imageType,
        accessibleName,
        codedAs,
        role,
    });

    return true;
}
