// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Mock, Times } from 'typemoq';

import { getPlatform } from '../../../../common/platform';
import { WindowUtils } from '../../../../common/window-utils';

describe('getPlatform', () => {
    const MAC_SHORTCUT = 'Command+Option+I';
    const WIN_LINUX_SHORTCUT = 'F12';
    test('getPlatform: mac', () => {
        const winMock = Mock.ofType(WindowUtils);
        winMock
            .setup(win => win.getPlatform())
            .returns(() => 'MACOSX')
            .verifiable(Times.once());

        expect(getPlatform(winMock.object).devToolsShortcut).toEqual(
            MAC_SHORTCUT,
        );
        winMock.verifyAll();
    });

    test('getPlatform: windows', () => {
        const winMock = Mock.ofType(WindowUtils);
        winMock
            .setup(win => win.getPlatform())
            .returns(() => 'Win32')
            .verifiable(Times.once());

        expect(getPlatform(winMock.object).devToolsShortcut).toEqual(
            WIN_LINUX_SHORTCUT,
        );
        winMock.verifyAll();
    });

    test('getPlatform: other', () => {
        const winMock = Mock.ofType(WindowUtils);
        winMock
            .setup(win => win.getPlatform())
            .returns(() => 'other')
            .verifiable(Times.once());

        expect(getPlatform(winMock.object).devToolsShortcut).toEqual(
            WIN_LINUX_SHORTCUT,
        );
        winMock.verifyAll();
    });
});
