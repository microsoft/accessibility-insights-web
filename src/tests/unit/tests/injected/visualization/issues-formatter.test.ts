// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock } from 'typemoq';

import { ClientBrowserAdapter } from '../../../../../common/client-browser-adapter';
import { WindowUtils } from '../../../../../common/window-utils';
import { FrameCommunicator } from '../../../../../injected/frameCommunicators/frame-communicator';
import { IHtmlElementAxeResults } from '../../../../../injected/scanner-utils';
import { ShadowUtils } from '../../../../../injected/shadow-utils';
import { IHeadingStyleConfiguration } from '../../../../../injected/visualization/heading-formatter';
import { IssuesFormatter } from '../../../../../injected/visualization/issues-formatter';

describe('IssuesFormatterTests', () => {
    let testSubject: IssuesFormatter;
    const htmlElement = document.createElement('div');
    let issuesStyle: IHeadingStyleConfiguration;

    beforeEach(() => {
        issuesStyle = IssuesFormatter.style;
        const frameCommunicator: IMock<FrameCommunicator> = Mock.ofType(FrameCommunicator);
        const windowUtils: IMock<WindowUtils> = Mock.ofType(WindowUtils);
        const shadowUtils: IMock<ShadowUtils> = Mock.ofType(ShadowUtils);
        const clientBrowserAdapter = Mock.ofType<ClientBrowserAdapter>();
        const getRTLMock = Mock.ofInstance(() => null);
        testSubject = new IssuesFormatter(
            frameCommunicator.object,
            windowUtils.object,
            shadowUtils.object,
            clientBrowserAdapter.object,
            getRTLMock.object,
        );
    });

    test('tooltip for the failed rules from the axe result', () => {
        const axeData: IHtmlElementAxeResults = {
            target: ['html'],
            isVisible: true,
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
                    fingerprint: 'fp1',
                    snippet: 'html',
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
                    fingerprint: 'fp2',
                    snippet: 'html',
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
