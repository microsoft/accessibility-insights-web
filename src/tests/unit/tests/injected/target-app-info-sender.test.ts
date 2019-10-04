// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock, Times } from 'typemoq';

import { Message } from '../../../../common/message';
import { Messages } from '../../../../common/messages';
import { TargetAppInfoSender } from '../../../../injected/target-app-info-sender';
import { TargetAppInfoPayload } from './../../../../background/actions/action-payloads';
import { TargetAppData } from './../../../../common/types/store-data/unified-data-interface';
import { MessageDelegate } from './../../../../injected/analyzers/rule-analyzer';

describe(TargetAppInfoSender, () => {
    it('should send expected target app info', () => {
        const appName = 'app name';
        const appUrl = 'app url';
        const targetAppInfo: TargetAppData = { name: appName, url: appUrl };
        const sendDelegate: IMock<MessageDelegate> = Mock.ofInstance(message => null);
        const domStub: Document = {
            title: appName,
            URL: appUrl,
        } as Document;
        const testSubject = new TargetAppInfoSender(sendDelegate.object, domStub);

        testSubject.send();

        const expectedPayload: TargetAppInfoPayload = {
            targetAppInfo,
        };
        const expectedMessage: Message = {
            messageType: Messages.TargetAppInfo.Update,
            payload: expectedPayload,
        };

        sendDelegate.verify(m => m(expectedMessage), Times.once());
    });
});
