// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getRTL } from '@uifabric/utilities';
import * as ReactDOM from 'react-dom';
import { ClientBrowserAdapter } from '../../common/client-browser-adapter';
import { HTMLElementUtils } from '../../common/html-element-utils';
import { WindowUtils } from '../../common/window-utils';
import { DialogRenderer } from '../dialog-renderer';
import { FrameCommunicator } from '../frameCommunicators/frame-communicator';
import { HtmlElementAxeResults } from '../scanner-utils';
import { ShadowUtils } from '../shadow-utils';
import { DrawerConfiguration, Formatter } from './formatter';
import { HeadingStyleConfiguration } from './heading-formatter';

export class IssuesFormatter implements Formatter {
    private dialogRenderer: DialogRenderer;

    constructor(
        frameCommunicator: FrameCommunicator,
        htmlElementUtils: HTMLElementUtils,
        windowUtils: WindowUtils,
        shadowUtils: ShadowUtils,
        clientBrowserAdapter: ClientBrowserAdapter,
        getRTLFunc: typeof getRTL,
    ) {
        this.dialogRenderer = new DialogRenderer(
            document,
            ReactDOM.render,
            frameCommunicator,
            htmlElementUtils,
            windowUtils,
            shadowUtils,
            clientBrowserAdapter,
            getRTLFunc,
        );
    }

    public static style: HeadingStyleConfiguration = {
        borderColor: '#CC0000',
        fontColor: '#FFFFFF',
    };

    public getDrawerConfiguration(element: HTMLElement, data: HtmlElementAxeResults): DrawerConfiguration {
        const config: DrawerConfiguration = {
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

    private getText(data: HtmlElementAxeResults): string {
        const ruleIds = Object.keys(data.ruleResults);
        return `Failed rules: ${ruleIds.join(', ')}`;
    }
}
