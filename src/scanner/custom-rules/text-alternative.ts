// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as AxeUtils from '../axe-utils';

import { RuleConfiguration } from '../iruleresults';
import { isImage } from './image-rule';

export const textAlternativeConfiguration: RuleConfiguration = {
    checks: [
        {
            id: 'text-alternative-data-collector',
            evaluate: evaluateTextAlternative,
        },
    ],
    rule: {
        id: 'accessible-image',
        selector: '*',
        any: ['text-alternative-data-collector'],
        all: [],
        matches: matches,
        enabled: false,
    },
};

function matches(node: HTMLElement): boolean {
    return isImage(node) && AxeUtils.getImageCodedAs(node) === 'Meaningful';
}

function evaluateTextAlternative(node: HTMLElement): boolean {
    const accessibleName: string = AxeUtils.getAccessibleText(node);
    const accessibleDescription: string = AxeUtils.getAccessibleDescription(node);
    const imageType: string | null = AxeUtils.getImageType(node);
    const role: string | null = node.getAttribute('role');

    // tslint:disable-next-line:no-invalid-this
    this.data({
        imageType,
        accessibleName,
        accessibleDescription,
        role,
    });

    return true;
}
