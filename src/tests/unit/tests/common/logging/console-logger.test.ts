// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GlobalMock, GlobalScope, MockBehavior, Times } from 'typemoq';

import { createDefaultLogger } from '../../../../../common/logging/default-logger';

describe('consoleLogger', () => {
    const message = 'this message';
    const otherArgs = ['string value', 2, true, null, {}];

    const testObject = createDefaultLogger();

    describe('console.log', () => {
        test('with message only', () => {
            const logMock = GlobalMock.ofInstance(console.log, 'log', console, MockBehavior.Strict);
            logMock.setup(l => l(message)).verifiable(Times.once());

            GlobalScope.using(logMock).with(() => {
                testObject.log(message);
            });

            logMock.verifyAll();
        });

        test('with optional parameters', () => {
            const logMock = GlobalMock.ofInstance(console.log, 'log', console, MockBehavior.Strict);
            logMock.setup(l => l(message, ...otherArgs)).verifiable(Times.once());

            GlobalScope.using(logMock).with(() => {
                testObject.log(message, ...otherArgs);
            });

            logMock.verifyAll();
        });
    });

    describe('console.error', () => {
        test('with message only', () => {
            const errorMock = GlobalMock.ofInstance(console.error, 'error', console, MockBehavior.Strict);
            errorMock.setup(e => e(message)).verifiable(Times.once());

            GlobalScope.using(errorMock).with(() => {
                testObject.error(message);

                errorMock.verifyAll();
            });
        });

        test('with optional parameters', () => {
            const errorMock = GlobalMock.ofInstance(console.error, 'error', console, MockBehavior.Strict);
            errorMock.setup(e => e(message, ...otherArgs)).verifiable(Times.once());

            GlobalScope.using(errorMock).with(() => {
                testObject.error(message, ...otherArgs);

                errorMock.verifyAll();
            });
        });
    });
});
