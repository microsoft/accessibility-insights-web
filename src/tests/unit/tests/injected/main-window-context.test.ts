// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { MainWindowContext } from 'injected/main-window-context';

describe(MainWindowContext, () => {
    const devToolStore: any = { name: 'devToolStore' };
    const userConfigStore: any = { name: 'userConfigStore' };
    const devToolActionMessageCreator: any = { name: 'devToolActionMessageCreator' };
    const targetPageActionMessageCreator: any = { name: 'targetPageActionMessageCreator' };
    const issueFilingActionMessageCreator: any = { name: 'targetPageActionMessageCreator' };
    const toolData: any = { name: 'toolData' };
    const issueFilingServiceProvider: any = { name: 'issueFilingServiceProvider' };
    const userConfigMessageCreator: any = { name: 'userConfigMessageCreator' };

    test('save and retrieve from instance', () => {
        const testSubject = new MainWindowContext(
            devToolStore,
            userConfigStore,
            devToolActionMessageCreator,
            targetPageActionMessageCreator,
            issueFilingActionMessageCreator,
            userConfigMessageCreator,
            toolData,
            issueFilingServiceProvider,
        );

        expect(testSubject.getDevToolStore()).toEqual(devToolStore);
        expect(testSubject.getUserConfigStore()).toEqual(userConfigStore);
        expect(testSubject.getDevToolActionMessageCreator()).toEqual(devToolActionMessageCreator);
        expect(testSubject.getTargetPageActionMessageCreator()).toEqual(
            targetPageActionMessageCreator,
        );
    });

    test('save and retrieve from window', () => {
        MainWindowContext.initialize(
            devToolStore,
            userConfigStore,
            devToolActionMessageCreator,
            targetPageActionMessageCreator,
            issueFilingActionMessageCreator,
            userConfigMessageCreator,
            toolData,
            issueFilingServiceProvider,
        );

        expect(MainWindowContext.fromWindow(window).getDevToolStore()).toEqual(devToolStore);
        expect(MainWindowContext.fromWindow(window).getUserConfigStore()).toEqual(userConfigStore);
        expect(MainWindowContext.fromWindow(window).getDevToolActionMessageCreator()).toEqual(
            devToolActionMessageCreator,
        );
        expect(MainWindowContext.fromWindow(window).getTargetPageActionMessageCreator()).toEqual(
            targetPageActionMessageCreator,
        );
        expect(MainWindowContext.fromWindow(window).getUserConfigMessageCreator()).toEqual(
            userConfigMessageCreator,
        );
        expect(MainWindowContext.fromWindow(window).getToolData()).toEqual(toolData);
        expect(MainWindowContext.fromWindow(window).getIssueFilingServiceProvider()).toEqual(
            issueFilingServiceProvider,
        );
    });
});
