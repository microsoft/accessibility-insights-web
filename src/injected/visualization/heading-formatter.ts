// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DialogRenderer } from '../dialog-renderer';
import { AssessmentVisualizationInstance } from '../frameCommunicators/html-element-axe-results-helper';
import { FailureInstanceFormatter } from './failure-instance-formatter';
import { DrawerConfiguration } from './formatter';

export interface HeadingStyleConfiguration {
    outlineColor: string;
    fontColor: string;
}

export interface StyleComputer {
    getComputedStyle(elt: Element, pseudoElt?: string): CSSStyleDeclaration;
}

interface HeadingScanData {
    propertyBag?: { headingText?: string };
    ruleResults?: Record<string, { any?: Array<{ data?: { headingText?: string } }> }>;
}

export class HeadingFormatter extends FailureInstanceFormatter {
    private styleComputer: StyleComputer;

    constructor(styleComputer: StyleComputer) {
        super();
        this.styleComputer = styleComputer;
    }

    public static headingStyles: { [level: string]: HeadingStyleConfiguration } = {
        '1': {
            outlineColor: '#0066CC',
            fontColor: '#FFFFFF',
        },
        '2': {
            outlineColor: '#CC0099',
            fontColor: '#FFFFFF',
        },
        '3': {
            outlineColor: '#008000',
            fontColor: '#FFFFFF',
        },
        '4': {
            outlineColor: '#6600CC',
            fontColor: '#FFFFFF',
        },
        '5': {
            outlineColor: '#008080',
            fontColor: '#FFFFFF',
        },
        '6': {
            outlineColor: '#996633',
            fontColor: '#FFFFFF',
        },
        blank: {
            outlineColor: '#C00000',
            fontColor: '#FFFFFF',
        },
    };

    public getDialogRenderer(): DialogRenderer | null {
        return null;
    }

    public getDrawerConfiguration(
        element: HTMLElement,
        data: AssessmentVisualizationInstance,
    ): DrawerConfiguration {
        const level = this.getAriaLevel(element) ?? this.getHTagLevel(element);
        const text = (this.isHTag(element) ? 'H' : 'h') + level;
        const style = HeadingFormatter.headingStyles[level] || HeadingFormatter.headingStyles.blank;

        const drawerConfig: DrawerConfiguration = {
            textBoxConfig: {
                fontColor: style.fontColor,
                text,
                background: style.outlineColor,
            },
            outlineColor: style.outlineColor,
            outlineStyle: 'solid',
            showVisualization: true,
            textAlign: 'center',
        };

        if (!this.hasContentToShow(element, data)) {
            drawerConfig.showVisualization = false;
        }

        if (data && data.isVisualizationEnabled != null && !data.isVisualizationEnabled) {
            drawerConfig.showVisualization = false;
        }

        if (this.getAttribute(element, 'aria-hidden') === 'true') {
            drawerConfig.showVisualization = false;
        }

        const compStyle = this.styleComputer.getComputedStyle(element);
        if (compStyle.display === 'none') {
            drawerConfig.showVisualization = false;
        }

        drawerConfig.failureBoxConfig = this.getFailureBoxConfig(data);

        return drawerConfig;
    }

    private isHTag(element: HTMLElement): boolean {
        return element.matches('h1,h2,h3,h4,h5,h6');
    }

    // Headings can have an accessible name without innerText (img alt, aria-*, slotted shadow content)
    private hasContentToShow(
        element: HTMLElement,
        data?: AssessmentVisualizationInstance,
    ): boolean {
        if (element.innerText) {
            return true;
        }

        if (this.getCollectedHeadingText(data)) {
            return true;
        }

        return this.getDomAccessibleText(element) !== '';
    }

    private getCollectedHeadingText(data?: AssessmentVisualizationInstance): string {
        if (data == null) {
            return '';
        }

        const scanData = data as Partial<HeadingScanData>;
        const propertyBagHeadingText = scanData.propertyBag?.headingText;
        if (propertyBagHeadingText) {
            return propertyBagHeadingText;
        }

        const ruleResults = scanData.ruleResults;
        if (ruleResults == null) {
            return '';
        }

        for (const ruleId of Object.keys(ruleResults)) {
            const checks = ruleResults[ruleId]?.any;
            if (!Array.isArray(checks)) {
                continue;
            }
            for (const check of checks) {
                const headingText = check?.data?.headingText;
                if (typeof headingText === 'string' && headingText !== '') {
                    return headingText;
                }
            }
        }

        return '';
    }

    private getDomAccessibleText(element: HTMLElement): string {
        const ariaLabel = element.getAttribute('aria-label');
        if (ariaLabel && ariaLabel.trim()) {
            return ariaLabel.trim();
        }

        const labelledBy = element.getAttribute('aria-labelledby');
        if (labelledBy) {
            const doc = element.ownerDocument;
            const label = labelledBy
                .split(/\s+/)
                .map(id => doc?.getElementById(id)?.textContent?.trim() ?? '')
                .filter(text => text.length > 0)
                .join(' ')
                .trim();
            if (label) {
                return label;
            }
        }

        const imgAlts = Array.from(element.querySelectorAll('img[alt]'))
            .map(img => img.getAttribute('alt')?.trim() ?? '')
            .filter(alt => alt.length > 0);
        if (imgAlts.length > 0) {
            return imgAlts.join(' ');
        }

        return (element.textContent ?? '').trim();
    }

    private getHTagLevel(element: HTMLElement): string {
        const headingLevel = element.tagName.toLowerCase().match(/h(\d)/);
        return headingLevel ? headingLevel[1] : '-';
    }

    private getAriaLevel(element: HTMLElement): string | null {
        const attr = element.attributes.getNamedItem('aria-level');
        return attr ? attr.textContent : null;
    }

    private getAttribute(element: HTMLElement, attrName: string): string | null {
        const attr = element.attributes.getNamedItem(attrName);
        return attr ? attr.textContent : null;
    }
}
