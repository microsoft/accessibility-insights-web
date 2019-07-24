// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { It, Mock } from 'typemoq';

import { BrowserAdapter } from '../../../../common/browser-adapters/browser-adapter';
import { configMutator } from '../../../../common/configuration';
import { WindowUtils } from '../../../../common/window-utils';
import { SupportLinkHandler } from '../../../../popup/support-link-handler';
import { itIsFunction } from '../../common/it-is-function';

describe('SupportLinkHandlerTest', () => {
    afterEach(configMutator.reset);

    test('sendEmail', () => {
        const alias = 'email.help.alias@unit.test';

        configMutator.setOption('emailHelpAlias', alias);

        const testTitle: string = 'test title';
        const expectedEmail: string = encodeURI(`mailto:${alias}?subject=Question about ${testTitle}`);
        const tabStub = {
            id: 101,
        };

        const browserAdapterMock = Mock.ofType<BrowserAdapter>();
        browserAdapterMock
            .setup(ca => ca.createInactiveTab(expectedEmail, It.isAny()))
            .callback((mail, cb) => {
                cb(tabStub);
            })
            .verifiable();

        browserAdapterMock.setup(ca => ca.closeTab(tabStub.id)).verifiable();

        const windowUtilsMock = Mock.ofType(WindowUtils);
        windowUtilsMock
            .setup(wu => wu.setTimeout(itIsFunction, 500))
            .callback((cb, timeout) => {
                cb();
            })
            .verifiable();

        const testObject = new SupportLinkHandler(browserAdapterMock.object, windowUtilsMock.object);

        testObject.sendEmail(testTitle);

        browserAdapterMock.verifyAll();
        windowUtilsMock.verifyAll();
    });
});
