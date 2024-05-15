// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getRTL } from '@fluentui/utilities';
import { NavigatorUtils } from 'common/navigator-utils';
import { HtmlElementAxeResults } from 'common/types/store-data/visualization-scan-result-data';
import { DialogRendererImpl } from 'injected/dialog-renderer-impl';
import { SingleFrameMessenger } from 'injected/frameCommunicators/single-frame-messenger';
import { createRoot } from 'react-dom/client';

import { BrowserAdapter } from '../../common/browser-adapters/browser-adapter';
import { HTMLElementUtils } from '../../common/html-element-utils';
import { WindowUtils } from '../../common/window-utils';
import { DetailsDialogHandler } from '../details-dialog-handler';
import { DialogRenderer } from '../dialog-renderer';
import { ShadowUtils } from '../shadow-utils';
import { DrawerConfiguration, Formatter } from './formatter';
import { HeadingStyleConfiguration } from './heading-formatter';

export class IssuesFormatter implements Formatter {
    private dialogRenderer: DialogRenderer;

    constructor(
        frameMessenger: SingleFrameMessenger,
        htmlElementUtils: HTMLElementUtils,
        windowUtils: WindowUtils,
        navigatorUtils: NavigatorUtils,
        shadowUtils: ShadowUtils,
        browserAdapter: BrowserAdapter,
        getRTLFunc: typeof getRTL,
        detailsDialogHandler: DetailsDialogHandler,
    ) {
        this.dialogRenderer = new DialogRendererImpl(
            document,
            createRoot,
            frameMessenger,
            htmlElementUtils,
            windowUtils,
            navigatorUtils,
            browserAdapter,
            getRTLFunc,
            detailsDialogHandler,
        );
    }

    public static style: HeadingStyleConfiguration = {
        outlineColor: '#E81123',
        fontColor: '#FFFFFF',
    };

    public getDrawerConfiguration(
        element: HTMLElement,
        data: HtmlElementAxeResults,
    ): DrawerConfiguration {
        const config: DrawerConfiguration = {
            failureBoxConfig: {
                background: IssuesFormatter.style.outlineColor,
                fontColor: '#FFFFFF',
                text: '!',
                hasDialogView: true,
                boxWidth: '2em',
            },
            outlineColor: IssuesFormatter.style.outlineColor,
            toolTip: this.getText(data),
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
