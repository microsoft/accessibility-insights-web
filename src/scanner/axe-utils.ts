// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as axe from 'axe-core';

import { DictionaryStringTo } from '../types/common-types';

export type ImageCodedAs = 'Decorative' | 'Meaningful';

export function getMatchesFromRule(
    ruleId: string,
): ((node: any, virtualNode: any) => boolean) | undefined {
    return axe._audit.rules.filter(rule => rule.id === ruleId)[0].matches;
}

export function getEvaluateFromCheck(
    checkId: string,
): (node: any, options: any, virtualNode: any, context: any) => boolean {
    return axe._audit.checks[checkId].evaluate;
}

export function getOptionsFromCheck(checkId: string): any {
    return axe._audit.checks[checkId].options;
}

export function getAccessibleText(node: HTMLElement, isLabelledByContext: boolean): string {
    return axe.commons.text.accessibleText(node, isLabelledByContext);
}

export function getAccessibleDescription(node: HTMLElement): string {
    return axe.commons.dom
        .idrefs(node, 'aria-describedby')
        .filter(ref => ref != null)
        .map(ref => axe.commons.text.accessibleText(ref))
        .join(' ');
}

export function getPropertyValuesMatching(
    node: HTMLElement,
    regex: RegExp,
): DictionaryStringTo<string> {
    const dictionary: DictionaryStringTo<string> = {};
    if (node.hasAttributes()) {
        const attrs = node.attributes;
        for (let i = 0; i < attrs.length; i++) {
            const name = attrs[i].name;
            if (regex.test(name)) {
                dictionary[name] = node.getAttribute(name)!;
            }
        }
    }
    return dictionary;
}

export function getAttributes(
    node: HTMLElement,
    attributes: string[],
): DictionaryStringTo<string | null> {
    const retDict: DictionaryStringTo<string | null> = {};
    attributes
        .filter(attributeName => node.hasAttribute(attributeName))
        .forEach(attributeName => {
            const attributeValue = node.getAttribute(attributeName)!;
            retDict[attributeName] = attributeValue.length > 0 ? attributeValue : null;
        });

    return retDict;
}

export function hasCustomWidgetMarkup(node: HTMLElement): boolean {
    const tabIndex = node.getAttribute('tabindex');
    const ariaValues = getPropertyValuesMatching(node, /^aria-/);
    const hasRole = node.hasAttribute('role');
    // empty and invalid roles can be filtered out using 'valid-role-if-present' check if needed
    return tabIndex === '-1' || Object.keys(ariaValues).length > 0 || hasRole;
}

export function getImageCodedAs(node: HTMLElement): ImageCodedAs | null {
    const role = node.getAttribute('role');
    const alt = node.getAttribute('alt');

    if (role === 'none' || role === 'presentation' || alt === '') {
        return 'Decorative';
    }

    if (node.tagName.toLowerCase() !== 'img' && role !== 'img') {
        // This covers implicitly decorative <svg>, <i>, and CSS background image cases
        return 'Decorative';
    }

    if (getAccessibleText(node, false) !== '' || isWhiteSpace(alt)) {
        return 'Meaningful';
    }

    return null;
}

export function isWhiteSpace(text: string | null): boolean {
    return text != null && text.length > 0 && text.trim() === '';
}

export function hasBackgoundImage(node: HTMLElement): boolean {
    const computedBackgroundImage: string = window
        .getComputedStyle(node)
        .getPropertyValue('background-image');
    return computedBackgroundImage !== 'none';
}

export function getImageType(node: HTMLElement): string | null {
    let imageType: string | null = null;
    if (node.tagName.toLowerCase() === 'img') {
        imageType = '<img>';
    } else if (node.tagName.toLowerCase() === 'i') {
        imageType = 'icon fonts (empty <i> elements)';
    } else if (node.getAttribute('role') === 'img') {
        imageType = 'Role="img"';
    } else if (hasBackgoundImage(node)) {
        imageType = 'CSS background-image';
    }

    return imageType;
}

// This will throw if called concurrently with an axe-core scan
export function withAxeSetup(operation: Function, rootElement?: HTMLElement) {
    axe.setup(rootElement ?? document.documentElement);
    try {
        return operation();
    } finally {
        axe.teardown();
    }
}

// This will throw if called concurrently with an axe-core scan
export function getUniqueSelector(element: HTMLElement): string {
    return withAxeSetup(() => axe.utils.getSelector(element));
}
