// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlags } from '../../../../../common/feature-flags';
import { DetailsDialog, DetailsDialogDeps, IDetailsDialogProps } from '../../../../../injected/components/details-dialog';
import { DecoratedAxeNodeResult } from '../../../../../injected/scanner-utils';

describe('DetailsDialogTest', () => {
    test('render: isDevToolsOpen = false, shadowDialog = false', () => {
        testRender(false, false);
    });

    test('render: isDevToolsOpen = false, shadowDialog = true', () => {
        testRender(false, true);
    });

    test('render: isDevToolsOpen = false, shadowDialog = true', () => {
        testRender(true, false);
    });

    test('render: isDevToolsOpen = true, shadowDialog = true', () => {
        testRender(true, true);
    });

    function testRender(isDevToolOpen: boolean, shadowDialog: boolean): void {
        const fingerprint: string = '12345678-9ABC-1234-1234-123456789ABC';
        const ruleId: string = 'ruleId';
        const help: string = 'help';
        const expectedNodeResult: DecoratedAxeNodeResult = {
            any: [],
            all: [],
            none: [],
            status: false,
            ruleId: ruleId,
            help: help,
            selector: 'selector',
            html: 'html',
            failureSummary: 'failureSummary',
            fingerprint: fingerprint,
            id: 'id1',
            guidanceLinks: [],
            helpUrl: 'help1',
            snippet: 'html',
        };
        const expectedFailedRules: IDictionaryStringTo<DecoratedAxeNodeResult> = {};
        expectedFailedRules[ruleId] = expectedNodeResult;

        const dialogDetailsHandlerMockObject = {
            getRuleUrl: () => 'test-url',
            isBackButtonDisabled: () => true,
            isNextButtonDisabled: () => true,
            isInspectButtonDisabled: () => !isDevToolOpen,
            getFailureInfo: () => 'Failure 1 of 1 for this target',
        };

        const deps: DetailsDialogDeps = {
            windowUtils: null,
            issueDetailsTextGenerator: null,
            targetPageActionMessageCreator: {
                copyIssueDetailsClicked: () => { },
            } as any,
        };

        const props: IDetailsDialogProps = {
            deps,
            elementSelector: ruleId,
            failedRules: expectedFailedRules,
            target: [],
            dialogHandler: dialogDetailsHandlerMockObject as any,
            featureFlagStoreData: {
                [FeatureFlags.shadowDialog]: shadowDialog,
            },
            devToolStore: {} as any,
            devToolActionMessageCreator: {} as any,
            devToolsShortcut: 'shortcut',
        };

        const onHideDialogMock = {};
        const onClickNextButtonMock = {};
        const onClickBackButtonMock = {};
        const onLayoutDidMountMock = {};

        const testObject = new DetailsDialog(props);
        (testObject as any).onHideDialog = onHideDialogMock;
        (testObject as any).onClickNextButton = onClickNextButtonMock;
        (testObject as any).onClickBackButton = onClickBackButtonMock;
        (testObject as any).onLayoutDidMount = onLayoutDidMountMock;

        expect(testObject.render()).toMatchSnapshot();
    }
});
