// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DialogRenderer } from '../dialog-renderer';
import { AssessmentVisualizationInstance } from '../frameCommunicators/html-element-axe-results-helper';
import { FailureInstanceFormatter } from './failure-instance-formatter';
import { DrawerConfiguration } from './formatter';

export class TableHeadersAttributeFormatter extends FailureInstanceFormatter {
    private readonly cellColor = '#6600CC';
    private readonly headerColor = '#0066CC';

    constructor() {
        super();
    }

    public getDialogRenderer(): DialogRenderer {
        return null;
    }

    public getDrawerConfiguration(
        element: HTMLElement,
        data: AssessmentVisualizationInstance,
    ): DrawerConfiguration {
        const isHeader = this.isHeader(element);

        const style = {
            borderColor: isHeader ? this.headerColor : this.cellColor,
            fontColor: '#FFFFFF',
        };

        const text = isHeader ? this.getTextForHeader(element) : this.getTextForCell(element);

        return {
            textBoxConfig: {
                fontColor: style.fontColor,
                text,
                background: style.borderColor,
            },
            borderColor: style.borderColor,
            outlineStyle: 'solid',
            showVisualization: true,
            textAlign: 'right',
            failureBoxConfig: this.getFailureBoxConfig(data),
        };
    }

    private isHeader(element: HTMLElement): boolean {
        if (element.matches('th')) {
            return true;
        }
        const role = this.getAttribute(element, 'role');
        if (role === 'columnheader' || role === 'rowheader') {
            return true;
        }
        return false;
    }

    private getTextForHeader(element: HTMLElement): string {
        const idText = `id="${this.getAttribute(element, 'id')}"`;
        const headersAttr = this.getAttribute(element, 'headers');
        const headersText = headersAttr === null ? null : `headers="${headersAttr}"`;

        return ['th', idText, headersText].join(' ');
    }

    private getTextForCell(element: HTMLElement): string {
        const headersAttr = this.getAttribute(element, 'headers');
        const headersText = headersAttr === null ? null : `headers="${headersAttr}"`;

        return ['td', headersText].join(' ');
    }

    private getAttribute(element: HTMLElement, attrName: string): string {
        const attr = element.attributes.getNamedItem(attrName);
        return attr ? attr.textContent : null;
    }
}
