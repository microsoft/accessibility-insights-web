// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NavigatorUtils } from 'common/navigator-utils';
import { FrameMessenger } from 'injected/frameCommunicators/frame-messenger';
import { IMock, Mock } from 'typemoq';

import { BrowserAdapter } from '../../../../../common/browser-adapters/browser-adapter';
import { HTMLElementUtils } from '../../../../../common/html-element-utils';
import { WindowUtils } from '../../../../../common/window-utils';
import { DetailsDialogHandler } from '../../../../../injected/details-dialog-handler';
import { HtmlElementAxeResults } from '../../../../../injected/scanner-utils';
import { ShadowUtils } from '../../../../../injected/shadow-utils';
import { HeadingStyleConfiguration } from '../../../../../injected/visualization/heading-formatter';
import { IssuesFormatter } from '../../../../../injected/visualization/issues-formatter';

describe('IssuesFormatterTests', () => {
    let testSubject: IssuesFormatter;
    const htmlElement = document.createElement('div');
    let issuesStyle: HeadingStyleConfiguration;
    let htmlElementUtilsMock: IMock<HTMLElementUtils>;
    beforeEach(() => {
        issuesStyle = IssuesFormatter.style;
        const frameMessenger: IMock<FrameMessenger> = Mock.ofType(FrameMessenger);
        htmlElementUtilsMock = Mock.ofType(HTMLElementUtils);
        const windowUtils: IMock<WindowUtils> = Mock.ofType(WindowUtils);
        const navigatorUtils: IMock<NavigatorUtils> = Mock.ofType(NavigatorUtils);
        const shadowUtils: IMock<ShadowUtils> = Mock.ofType(ShadowUtils);
        const browserAdapter = Mock.ofType<BrowserAdapter>();
        const getRTLMock = Mock.ofInstance(() => null);
        const detailsDialogHandlerMock = Mock.ofType<DetailsDialogHandler>();
        testSubject = new IssuesFormatter(
            frameMessenger.object,
            htmlElementUtilsMock.object,
            windowUtils.object,
            navigatorUtils.object,
            shadowUtils.object,
            browserAdapter.object,
            getRTLMock.object,
            detailsDialogHandlerMock.object,
        );
    });

    test('tooltip for the failed rules from the axe result', () => {
        const axeData: HtmlElementAxeResults = {
            target: ['html'],
            ruleResults: {
                rule1: {
                    any: [],
                    none: [],
                    all: [],
                    status: true,
                    ruleId: 'rule1',
                    selector: 'selector',
                    html: 'html',
                    failureSummary: 'failureSummary',
                    help: 'help1',
                    id: 'id1',
                    guidanceLinks: [],
                    helpUrl: 'help1',
                },
                rule2: {
                    any: [],
                    none: [],
                    all: [],
                    status: true,
                    ruleId: 'rule2',
                    selector: 'selector',
                    html: 'html',
                    failureSummary: 'failureSummary',
                    help: 'help2',
                    id: 'id2',
                    guidanceLinks: [],
                    helpUrl: 'help2',
                },
            },
        };

        const config = testSubject.getDrawerConfiguration(htmlElement, axeData);

        expect(config.showVisualization).toBe(true);
        expect(config.borderColor).toEqual(issuesStyle.borderColor);
        expect(config.failureBoxConfig.fontColor).toEqual(issuesStyle.fontColor);
        expect(config.failureBoxConfig.text).toEqual('!');
        expect(config.failureBoxConfig.boxWidth).toEqual('2em');
        expect(config.textAlign).toEqual('center');
        expect(config.cursor).toEqual('pointer');
        expect(config.toolTip).toEqual('Failed rules: rule1, rule2');
    });
});
