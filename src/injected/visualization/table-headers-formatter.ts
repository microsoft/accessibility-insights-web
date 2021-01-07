// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { isEmpty } from 'lodash';
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
        const isHeader = element.matches('th');

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

    private getTextForHeader(element: HTMLElement): string {
        const idText = `id="${this.getAttribute(element, 'id')}"`;
        const headersAttr = this.getAttribute(element, 'headers');
        const headersText = headersAttr === null ? null : `headers="${headersAttr}"`;

        return ['th', idText, headersText].filter(str => !isEmpty(str)).join(' ');
    }

    private getTextForCell(element: HTMLElement): string {
        const headersAttr = this.getAttribute(element, 'headers');
        const headersText = headersAttr === null ? null : `headers="${headersAttr}"`;

        return ['td', headersText].filter(str => !isEmpty(str)).join(' ');
    }

    private getAttribute(element: HTMLElement, attrName: string): string {
        const attr = element.attributes.getNamedItem(attrName);
        return attr ? attr.textContent : null;
    }
}
