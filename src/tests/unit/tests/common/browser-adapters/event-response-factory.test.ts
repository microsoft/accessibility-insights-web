// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EventResponseFactory } from 'common/browser-adapters/event-response-factory';
import { TimeoutError } from 'common/promises/promise-factory';
import { TimeSimulatingPromiseFactory } from 'tests/unit/common/time-simulating-promise-factory';
import { IMock, It, Mock, MockBehavior } from 'typemoq';

describe(EventResponseFactory, () => {
    let timeSimulatingPromiseFactory: TimeSimulatingPromiseFactory;
    let testSubject: EventResponseFactory;

    beforeEach(() => {
        timeSimulatingPromiseFactory = new TimeSimulatingPromiseFactory();
    });

    describe('applyEventTimeout', () => {
        it.each([true, false])(
            'applies a 60 second timeout when isServiceWorker=%p',
            async isServiceWorker => {
                testSubject = new EventResponseFactory(timeSimulatingPromiseFactory);

                const slowPromise = timeSimulatingPromiseFactory.externalResolutionPromise();
                const result = testSubject.applyEventTimeout(slowPromise.promise, 'error context');

                await expect(result).rejects.toBeInstanceOf(TimeoutError);
                expect(timeSimulatingPromiseFactory.elapsedTime).toBe(60000);

                slowPromise.resolveHook(null); // clean up floating promise
            },
        );
    });

    describe('mergeBrowserMessageResponses', () => {
        beforeEach(() => {
            testSubject = new EventResponseFactory(timeSimulatingPromiseFactory);
        });

        it('returns messageHandled false if no interpreter handled the message', () => {
            const output = testSubject.mergeBrowserMessageResponses([
                { messageHandled: false },
                { messageHandled: false },
                { messageHandled: false },
            ]);

            expect(output).toStrictEqual({ messageHandled: false });
        });

        it('delegates to mergeRawBrowserMessageResponses behavior if some responses handle the message', () => {
            const mixedResponses = [
                { messageHandled: true as const, result: undefined },
                { messageHandled: false as const },
                { messageHandled: true as const, result: Promise.resolve() },
            ];
            const handledResults = [undefined, mixedResponses[2].result];

            const mergeResponsesResult = Promise.resolve();
            testSubject.mergeRawBrowserMessageResponses = jest.fn(() => mergeResponsesResult);

            const mergedOutput = testSubject.mergeBrowserMessageResponses(mixedResponses);

            expect(mergedOutput.messageHandled).toBe(true);
            expect(testSubject.mergeRawBrowserMessageResponses).toHaveBeenCalledWith(
                handledResults,
            );
            expect(mergedOutput.result).toBe(mergeResponsesResult);
        });
    });

    describe('mergeRawBrowserMessageResponses', () => {
        let mergeAsyncResponsesMock: IMock<(promises: Promise<unknown>[]) => Promise<void>>;

        beforeEach(() => {
            mergeAsyncResponsesMock = Mock.ofInstance(_ => Promise.resolve(), MockBehavior.Strict);

            testSubject = new EventResponseFactory(
                timeSimulatingPromiseFactory,
                mergeAsyncResponsesMock.object,
            );
        });

        afterEach(() => {
            mergeAsyncResponsesMock.verifyAll();
        });

        it('returns void if all inputs are void', async () => {
            expect(
                testSubject.mergeRawBrowserMessageResponses([undefined, undefined, undefined]),
            ).toBe(undefined);
        });

        it('returns input without wrapping for a single async response', async () => {
            const input = Promise.resolve();
            expect(testSubject.mergeRawBrowserMessageResponses([input])).toBe(input);
        });

        it('returns wrapped combined promise for multiple async responses', async () => {
            const inputs = [
                timeSimulatingPromiseFactory.delay(undefined, 2),
                timeSimulatingPromiseFactory.delay(undefined, 5),
                timeSimulatingPromiseFactory.delay(undefined, 3),
            ];
            const mergedPromise = Promise.resolve();

            mergeAsyncResponsesMock
                .setup(m => m(inputs))
                .returns(() => mergedPromise)
                .verifiable();

            const result = testSubject.mergeRawBrowserMessageResponses(inputs);

            expect(result).toBe(mergedPromise);

            await mergedPromise;
        });

        it('returns wrapped combined promise for mixed input types', async () => {
            const asyncInputs = [
                timeSimulatingPromiseFactory.delay(undefined, 1),
                timeSimulatingPromiseFactory.delay(undefined, 2),
            ];
            const inputs = [undefined, ...asyncInputs, undefined];
            mergeAsyncResponsesMock
                .setup(m => m(It.isAny()))
                .returns(async promises => {
                    await Promise.all(promises);
                });

            await testSubject.mergeRawBrowserMessageResponses(inputs);

            expect(timeSimulatingPromiseFactory.elapsedTime).toBe(2);
        });
    });
});
