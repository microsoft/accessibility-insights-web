// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
/// <reference path="./iformatter.d.ts" />
/// <reference path="./heading-formatter.ts" />
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { WindowUtils } from '../../common/window-utils';
import { FrameCommunicator } from '../frameCommunicators/frame-communicator';
import { DialogRenderer } from '../dialog-renderer';
import { IHtmlElementAxeResults } from '../scanner-utils';
import { ShadowUtils } from '../shadow-utils';
import { IHeadingStyleConfiguration } from './heading-formatter';
import { IDrawerConfiguration, IFormatter } from './iformatter';
import { ClientBrowserAdapter } from '../../common/client-browser-adapter';

export class IssuesFormatter implements IFormatter {
    private dialogRenderer: DialogRenderer;

    constructor(
        frameCommunicator: FrameCommunicator,
        windowUtils: WindowUtils,
        shadowUtils: ShadowUtils,
        clientBrowserAdapter: ClientBrowserAdapter,
    ) {
        this.dialogRenderer = new DialogRenderer(
            document,
            ReactDOM.render,
            frameCommunicator,
            windowUtils,
            shadowUtils,
            clientBrowserAdapter,
        );
    }

    public static style: IHeadingStyleConfiguration = {
        borderColor: '#CC0000',
        fontColor: '#FFFFFF',
    };

    public getDrawerConfiguration(element: HTMLElement, data: IHtmlElementAxeResults): IDrawerConfiguration {
        const config: IDrawerConfiguration = {
            failureBoxConfig: {
                background: IssuesFormatter.style.borderColor,
                fontColor: '#FFFFFF',
                text: '!',
                hasDialogView: true,
                boxWidth: '2em',
            },
            borderColor: IssuesFormatter.style.borderColor,
            toolTip: this.getText(data),
            outlineStyle: 'solid',
            showVisualization: true,
            textAlign: 'center',
            cursor: 'pointer',
        };

        return config;
    }

    public getDialogRenderer(): DialogRenderer {
        return this.dialogRenderer;
    }

    private getText(data: IHtmlElementAxeResults): string {
        const ruleIds = Object.keys(data.ruleResults);
        return `Failed rules: ${ruleIds.join(', ')}`;
    }
}
