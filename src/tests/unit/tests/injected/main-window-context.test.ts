// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { MainWindowContext } from '../../../../injected/main-window-context';

describe('MainWindowContextTest', () => {
    const devToolStore: any = { name: 'devToolStore' };
    const devToolActionMessageCreator: any = { name: 'devToolActionMessageCreator' };
    const targetPageActionMessageCreator: any = { name: 'targetPageActionMessageCreator' };


    test('save and retrieve from instance', () => {
        const testSubject = new MainWindowContext(
            devToolStore,
            devToolActionMessageCreator,
            targetPageActionMessageCreator,
        );

        expect(testSubject.getDevToolStore()).toEqual(devToolStore);
        expect(testSubject.getDevToolActionMessageCreator()).toEqual(devToolActionMessageCreator);
        expect(testSubject.getTargetPageActionMessageCreator()).toEqual(targetPageActionMessageCreator);
    });

    test('save and retrieve from window', () => {
        MainWindowContext.initialize(
            devToolStore,
            devToolActionMessageCreator,
            targetPageActionMessageCreator,
        );

        expect(MainWindowContext.get().getDevToolStore()).toEqual(devToolStore);
        expect(MainWindowContext.get().getDevToolActionMessageCreator()).toEqual(devToolActionMessageCreator);
        expect(MainWindowContext.get().getTargetPageActionMessageCreator()).toEqual(targetPageActionMessageCreator);
    });

    test('getIfNotGiven', () => {
        MainWindowContext.initialize(
            devToolStore,
            devToolActionMessageCreator,
            targetPageActionMessageCreator,
        );

        const devToolStoreLocal: any = { name: 'devToolStoreLocal' };
        const devToolActionMessageCreatorLocal: any = { name: 'devToolActionMessageCreatorLocal' };

        const mainWindowContextLocal = new MainWindowContext(
            devToolStoreLocal,
            devToolActionMessageCreatorLocal,
            targetPageActionMessageCreator,
        );

        const mainWindowContextGiven = MainWindowContext.getIfNotGiven(mainWindowContextLocal);
        expect(mainWindowContextGiven.getDevToolStore()).toEqual(devToolStoreLocal);
        expect(mainWindowContextGiven.getDevToolActionMessageCreator()).toEqual(devToolActionMessageCreatorLocal);
        expect(mainWindowContextGiven.getTargetPageActionMessageCreator()).toEqual(targetPageActionMessageCreator);

        const mainWindowContextNotGiven = MainWindowContext.getIfNotGiven(null);
        expect(mainWindowContextNotGiven.getDevToolStore()).toEqual(devToolStore);
        expect(mainWindowContextNotGiven.getDevToolActionMessageCreator()).toEqual(devToolActionMessageCreator);
        expect(mainWindowContextNotGiven.getTargetPageActionMessageCreator()).toEqual(targetPageActionMessageCreator);
    });
});
