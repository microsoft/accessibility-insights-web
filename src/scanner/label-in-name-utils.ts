// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

/*
 * This file contains code adapted from axe-core (https://github.com/dequelabs/axe-core)
 * which is distributed under the Mozilla Public License, v. 2.0.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. You can obtain a copy of this license at http://mozilla.org/MPL/2.0/.
 *
 * */

import axe from 'axe-core';
import * as AxeUtils from './axe-utils';

const { sanitize, isHumanInterpretable, subtreeText } = axe.commons.text;

export function labelInNameMatches(node: HTMLElement, virtualNode: any) {
    const accessibleName = (node.getAttribute('aria-label') || node.getAttribute('aria-labelledby')) ? AxeUtils.getAccessibleText(node) : '';
    if (accessibleName === '' || !isHumanInterpretable(accessibleName)) {
        return false;
    }
    const visibleText = getVisibleText(virtualNode);
    if (visibleText === '' || !isHumanInterpretable(visibleText)) {
        return false;
    }
    console.log(visibleText);
    return true;
}

export function getLabelInNameData(node: HTMLElement, virtualNode: any) {
    console.log(node, virtualNode)
    const visibleText = getVisibleText(virtualNode);
    const accessibleName = sanitize(AxeUtils.getAccessibleText(node));
    const url = node.getAttribute('href');
    const labelInName = accessibleName.toLowerCase().includes(visibleText.toLowerCase());
    console.log(visibleText, accessibleName, url, labelInName)
    return { visibleText, accessibleName, url, labelInName };
}

export function getVirtualNode(node: HTMLElement) {
    const virtualNode = AxeUtils.withAxeSetup(() =>
        axe.utils.getNodeFromTree(node),
    );
    return virtualNode;
}

function getVisibleText(virtualNode: any): string {
    const visibleTextSubtreeOptions = {
        subtreeDescendant: true,
        ignoreIconLigature: true,
        ...AxeUtils.getOptionsFromCheck('label-content-name-mismatch'),
    };
    const containedText = subtreeText(virtualNode, visibleTextSubtreeOptions);
    const sanitizedText = axe.commons.text.sanitize(containedText);
    return sanitizedText;
}
