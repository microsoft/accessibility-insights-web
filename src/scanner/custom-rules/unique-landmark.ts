// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as axe from 'axe-core';

import { RuleConfiguration } from '../iruleresults';

const id: string = 'unique-landmark';
const passMessage: string =
    'Landmarks must have a unique role or role/label combination (aria-label OR aria-labelledby)';
const failMessage: string =
    'The landmarks do not have a unique role or role/label combination (use aria-label OR aria-labelledby to make landmarks distinguishable)';
const descriptionHelp = {
    description: 'unique landmarks test',
    help: passMessage,
};

export const uniqueLandmarkConfiguration: RuleConfiguration = {
    checks: [
        {
            id,
            evaluate,
            passMessage: () => passMessage,
            failMessage: () => failMessage,
        },
    ],
    rule: {
        id,
        selector:
            '[role=banner], [role=complementary], [role=contentinfo], [role=main], [role=navigation], [role=region], [role=search], [role=form], form, footer, header, aside, main, nav, section',
        any: [id],
        matches: function matches(node: any): boolean {
            return isLandmark(node) && axe.commons.dom.isVisible(node, true);
        },
        ...descriptionHelp,
        helpUrl: '/insights.html#/content/rules/uniqueLandmark',
        tags: ['best-practice', 'wcag241'],
    },
};

export const uniqueLandmarkRuleContent: axe.RuleLocale = {
    [id]: descriptionHelp,
};

function isLandmark(element: any): boolean {
    const landmarkRoles = axe.commons.aria.getRolesByType('landmark');
    const role = getObservedRoleForElement(element);

    return (role && landmarkRoles.indexOf(role) >= 0) || role === 'region';
}

function getRoleSelectors(roleId: any): any[] {
    const role = axe.commons.aria.lookupTable.role[roleId];
    let selectors: Array<any> = [];
    if (role && role.implicit) {
        selectors = selectors.concat(role.implicit);
    }
    selectors.push("[role='" + roleId + "']");
    return selectors;
}

function getObservedRoleForElement(element: any): any {
    let role = element.getAttribute('role');
    role = role ? role.trim() : role;
    if (!role) {
        role = axe.commons.aria.implicitRole(element);
        const tagName = element.tagName.toLowerCase();
        if (tagName === 'header' || tagName === 'footer') {
            let parent = element.parentNode;
            while (parent && parent.nodeType === 1) {
                const parentTagName = parent.tagName.toLowerCase();
                const excludedDescendants = ['article', 'aside', 'main', 'nav', 'section'];
                if (excludedDescendants.indexOf(parentTagName) >= 0) {
                    role = null;
                }
                parent = parent.parentNode;
            }
        } else if (tagName === 'section' || tagName === 'form') {
            const label = getLandmarkLabel(element);
            if (!label) {
                role = null;
            }
        }
    }
    if (role) {
        role = role.toLowerCase();
    }
    return role;
}

function getLandmarkLabel(element: any): string | null {
    if (!element || typeof element.hasAttribute !== 'function') {
        return null;
    }
    if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
        return null;
    }
    try {
        const accessibleText: string = axe.commons.text.accessibleText(element);
        if (accessibleText && accessibleText.trim().length > 0) {
            return accessibleText.trim();
        }
    } catch {
        // Fallback to axe.commons.aria.label if accessibleText throws
    }
    try {
        const label: string = axe.commons.aria.label(element);
        if (label && label.trim().length > 0) {
            return label.trim();
        }
    } catch {
        // Fallback to direct aria-label attribute
    }
    const ariaLabel = element.getAttribute('aria-label');
    return ariaLabel && ariaLabel.trim().length > 0 ? ariaLabel.trim() : null;
}

function evaluate(node: any, options: any): boolean {
    if (isLandmark(node) === false) {
        return false;
    }

    const role = getObservedRoleForElement(node);
    let label = getLandmarkLabel(node);
    let candidates: Array<any> = [];
    const selectors = getRoleSelectors(role);
    const selectorsLength = selectors.length;
    label = label ? label.toLowerCase() : null;
    // tslint:disable-next-line:no-invalid-this
    this.data({ role: role, label: label });
    for (let selectorPos = 0; selectorPos < selectorsLength; selectorPos++) {
        candidates = candidates.concat(
            axe.utils.toArray(document.querySelectorAll(selectors[selectorPos])),
        );
    }
    const candidatesLength = candidates.length;
    if (candidatesLength > 1) {
        for (let candidatePos = 0; candidatePos < candidatesLength; candidatePos++) {
            const candidate = candidates[candidatePos];
            if (
                candidate !== node &&
                isLandmark(candidate) &&
                axe.commons.dom.isVisible(candidate, true)
            ) {
                let candidateLabel = getLandmarkLabel(candidate);
                candidateLabel = candidateLabel ? candidateLabel.toLowerCase() : null;
                if (label === candidateLabel) {
                    return false;
                }
            }
        }
    }

    return true;
}
