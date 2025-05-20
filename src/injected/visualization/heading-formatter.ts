// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TargetHelper } from '../../common/target-helper';
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

        if (!element.innerText && !TargetHelper.getSlotInnerTextFromElementNode(element)) {
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

