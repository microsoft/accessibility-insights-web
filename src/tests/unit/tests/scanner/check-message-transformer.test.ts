// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CheckMessageTransformer } from '../../../../scanner/check-message-transformer';
import {
    FormattedCheckResult,
    ICheckConfiguration,
} from '../../../../scanner/iruleresults';

describe('CheckMessageTransformer', () => {
    describe('constructor', () => {
        it('should construct the generator', () => {
            const testSubject = new CheckMessageTransformer();
            expect(testSubject).not.toBeNull();
        });
    });

    describe('addMessagesToChecks', () => {
        it("config doesn't exist for check, don't do anything", () => {
            const testSubject = new CheckMessageTransformer();
            const checkConfigurations = [];
            const checksStub = [getCheckStub()];
            const expectedChecks = [getCheckStub()];

            testSubject.addMessagesToChecks(checksStub, checkConfigurations);

            expect(checksStub).toEqual(expectedChecks);
        });

        it('result is pass with pass message', () => {
            const testSubject = new CheckMessageTransformer();
            const checkConfigurations: ICheckConfiguration[] = [
                {
                    id: 'id1',
                    passMessage: () => 'fake message',
                } as ICheckConfiguration,
            ];
            const checksStub = [getCheckStub('id1', true)];

            const expectedChecks = [getCheckStub('id1', true)];
            expectedChecks[0].message = 'fake message';

            testSubject.addMessagesToChecks(checksStub, checkConfigurations);

            expect(checksStub).toEqual(expectedChecks);
        });

        it('result is pass but no pass message', () => {
            const testSubject = new CheckMessageTransformer();
            const checkConfigurations: ICheckConfiguration[] = [
                {
                    id: 'id1',
                } as ICheckConfiguration,
            ];
            const checksStub = [getCheckStub('id1', true)];
            const expectedChecks = [getCheckStub('id1', true)];

            testSubject.addMessagesToChecks(checksStub, checkConfigurations);

            expect(checksStub).toEqual(expectedChecks);
        });

        it('result is pass with fail message', () => {
            const testSubject = new CheckMessageTransformer();
            const checkConfigurations: ICheckConfiguration[] = [
                {
                    id: 'id1',
                    failMessage: () => 'fake message',
                } as ICheckConfiguration,
            ];
            const checksStub = [getCheckStub('id1')];

            const expectedChecks = [getCheckStub('id1')];
            expectedChecks[0].message = 'fake message';

            testSubject.addMessagesToChecks(checksStub, checkConfigurations);

            expect(checksStub).toEqual(expectedChecks);
        });

        it('result is pass but no fail message', () => {
            const testSubject = new CheckMessageTransformer();
            const checkConfigurations: ICheckConfiguration[] = [
                {
                    id: 'id1',
                } as ICheckConfiguration,
            ];
            const checksStub = [getCheckStub('id1')];
            const expectedChecks = [getCheckStub('id1')];

            testSubject.addMessagesToChecks(checksStub, checkConfigurations);

            expect(checksStub).toEqual(expectedChecks);
        });
    });

    function getCheckStub(
        id = 'fake id',
        status = false,
    ): FormattedCheckResult {
        return {
            id: id,
            result: status,
            message: null,
            data: null,
        };
    }
});
