// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DateProvider } from 'common/date-provider';
import { TabStopEvent } from 'common/types/store-data/tab-stop-event';
import { SingleFrameTabStopListener } from 'injected/single-frame-tab-stop-listener';
import { getUniqueSelector } from 'scanner/axe-utils';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('SingleFrameTabStopListener', () => {
    const exampleTabStopEvent: TabStopEvent = {
        timestamp: 10,
        target: ['selector'],
        html: 'outer-html',
    };

    test('start', async () => {
        const domMock = Mock.ofType<Document>(null, MockBehavior.Strict);

        const singleFrameTabStopListener = new SingleFrameTabStopListener(
            'single-frame-tab-stop-listener',
            null,
            domMock.object,
            null,
        );

        await captureOnFocusHandler(domMock, singleFrameTabStopListener);
        domMock.verifyAll();
    });

    test('stop', async () => {
        const domMock = Mock.ofType<Document>(null, MockBehavior.Strict);

        const singleFrameTabStopListener = new SingleFrameTabStopListener(
            'single-frame-tab-stop-listener',
            null,
            domMock.object,
            null,
        );

        domMock.setup(m => m.removeEventListener('focusin', It.isAny())).verifiable(Times.once());

        await singleFrameTabStopListener.stop();
        domMock.verifyAll();
    });

    test('transformChildResultForParent', () => {
        const getUniqueSelectorMock = Mock.ofInstance(getUniqueSelector, MockBehavior.Strict);

        const singleFrameTabStopListener = new SingleFrameTabStopListener(
            'single-frame-tab-stop-listener',
            getUniqueSelectorMock.object,
            null,
            null,
        );

        const expectedTransformedEvent: TabStopEvent = {
            timestamp: exampleTabStopEvent.timestamp,
            html: exampleTabStopEvent.html,
            target: ['selector', ...exampleTabStopEvent.target],
        };

        const exampleFrame = {} as HTMLIFrameElement;
        getUniqueSelectorMock
            .setup(m => m(exampleFrame))
            .returns(_ => 'selector')
            .verifiable(Times.once());

        const transformedEvent = singleFrameTabStopListener.transformChildResultForParent(
            exampleTabStopEvent,
            exampleFrame,
        );

        expect(transformedEvent).toStrictEqual(expectedTransformedEvent);

        getUniqueSelectorMock.verifyAll();
    });

    test('focusin handler reports event to passed-in callback', async () => {
        const domMock = Mock.ofType<Document>(null, MockBehavior.Strict);
        const getUniqueSelectorMock = Mock.ofInstance(getUniqueSelector, MockBehavior.Strict);
        const getCurrentDateMock = Mock.ofInstance(
            DateProvider.getCurrentDate,
            MockBehavior.Strict,
        );

        const singleFrameTabStopListener = new SingleFrameTabStopListener(
            'single-frame-tab-stop-listener',
            getUniqueSelectorMock.object,
            domMock.object,
            getCurrentDateMock.object,
        );

        const onFocusCallback = await captureOnFocusHandler(domMock, singleFrameTabStopListener);

        const fakeEvent = {
            target: {
                outerHTML: exampleTabStopEvent.html,
            },
        } as unknown as Event;

        getCurrentDateMock
            .setup(m => m())
            .returns(
                _ =>
                    ({
                        getTime: () => exampleTabStopEvent.timestamp,
                    }) as Date,
            )
            .verifiable(Times.once());

        getUniqueSelectorMock
            .setup(m => m(fakeEvent.target as HTMLElement))
            .returns(_ => exampleTabStopEvent.target[0] as string)
            .verifiable(Times.once());

        const reportResultMock = Mock.ofInstance(async (_: TabStopEvent) => {});
        singleFrameTabStopListener.setResultCallback(reportResultMock.object);
        reportResultMock.setup(m => m(exampleTabStopEvent)).verifiable(Times.once());
        await onFocusCallback(fakeEvent);

        getCurrentDateMock.verifyAll();
        getUniqueSelectorMock.verifyAll();
        reportResultMock.verifyAll();
    });

    const captureOnFocusHandler = async (
        domMock: IMock<Document>,
        singleFrameTabStopListener: SingleFrameTabStopListener,
    ): Promise<(event: Event) => Promise<void>> => {
        let onFocusCallback: (event: Event) => Promise<void> = null;
        domMock
            .setup(m => m.addEventListener('focusin', It.isAny()))
            .callback((_, func) => (onFocusCallback = func))
            .verifiable(Times.once());

        await singleFrameTabStopListener.start();

        return onFocusCallback;
    };
});
