// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ShadowDomFocusTracker } from 'injected/shadow-dom-focus-tracker';
import { IMock, It, Mock, Times } from 'typemoq';

class ConcreteShadowDomFocusTracker extends ShadowDomFocusTracker {
    public focusInCallback: (target: HTMLElement) => Promise<void>;

    public addShadowRoots(shadowRoots: ShadowRoot[]) {
        this.shadowRoots.push(...shadowRoots);
    }
}

describe(ShadowDomFocusTracker, () => {
    let testSubject: ConcreteShadowDomFocusTracker;
    let documentMock: IMock<Document>;
    let shadowRootMock: IMock<ShadowRoot>;
    let shadowRootsListStub: ShadowRoot[];

    beforeEach(() => {
        documentMock = Mock.ofType<Document>();
        shadowRootMock = Mock.ofType<ShadowRoot>();
        shadowRootsListStub = [shadowRootMock.object, null, undefined];
        testSubject = new ConcreteShadowDomFocusTracker(documentMock.object);
    });

    afterEach(() => {
        documentMock.verifyAll();
        shadowRootMock.verifyAll();
    });

    it('adds dom listener on start', async () => {
        documentMock
            .setup(dm => dm.addEventListener('focusin', It.isAny()))
            .verifiable(Times.once());
        await testSubject.start();
    });

    it('removes dom listener on stop', async () => {
        documentMock
            .setup(dm => dm.removeEventListener('focusin', It.isAny()))
            .verifiable(Times.once());
        await testSubject.stop();
    });

    it('removes shadow dom listeners on stop', async () => {
        testSubject.addShadowRoots(shadowRootsListStub);

        documentMock
            .setup(dm => dm.removeEventListener('focusin', It.isAny()))
            .verifiable(Times.exactly(1));
        shadowRootMock
            .setup(dm => dm.removeEventListener('focusin', It.isAny()))
            .verifiable(Times.exactly(1));

        await testSubject.stop();
    });

    describe('Focusin Callback', () => {
        let onFocusCallback: (event: Event) => Promise<void>;
        let eventMock: IMock<Event>;
        let targetMock: IMock<HTMLElement>;
        let focusInCallbackMock: IMock<(target: HTMLElement) => Promise<void>>;

        beforeEach(async () => {
            focusInCallbackMock = Mock.ofInstance(_ => null);
            testSubject.focusInCallback = focusInCallbackMock.object;

            targetMock = Mock.ofType<HTMLElement>();
            eventMock = Mock.ofType<Event>();
            eventMock
                .setup(m => m.target)
                .returns(() => targetMock.object)
                .verifiable(Times.once());
            documentMock
                .setup(m => m.addEventListener('focusin', It.isAny()))
                .callback((_, func) => (onFocusCallback = func));
            await testSubject.start();
        });

        afterEach(() => {
            eventMock.verifyAll();
            focusInCallbackMock.verifyAll();
        });

        it('calls focusInCallback with target when no shadow dom exists', async () => {
            focusInCallbackMock
                .setup(callback => callback(targetMock.object))
                .verifiable(Times.once());
            await onFocusCallback(eventMock.object);
        });

        it('calls focusInCallback with target when no active element exists in the shadow dom', async () => {
            targetMock
                .setup(m => m.shadowRoot)
                .returns(_ => {
                    return {} as ShadowRoot;
                })
                .verifiable(Times.once());

            focusInCallbackMock
                .setup(callback => callback(targetMock.object))
                .verifiable(Times.once());

            await onFocusCallback(eventMock.object);
        });

        it('calls focusInCallback with shadow dom target when shadow dom exists', async () => {
            setUpShadowDom();

            await onFocusCallback(eventMock.object);
        });

        it('adds listener to new shadow root', async () => {
            setUpShadowDom();

            shadowRootMock
                .setup(dm => dm.addEventListener('focusin', It.isAny()))
                .verifiable(Times.once());

            await onFocusCallback(eventMock.object);
        });

        it('does not add listener to old shadow root', async () => {
            setUpShadowDom();

            testSubject.addShadowRoots(shadowRootsListStub);
            shadowRootMock
                .setup(dm => dm.addEventListener('focusin', It.isAny()))
                .verifiable(Times.never());

            await onFocusCallback(eventMock.object);
        });

        function setUpShadowDom() {
            const shadowDomActiveElement = {} as HTMLElement;
            targetMock
                .setup(m => m.shadowRoot)
                .returns(_ => shadowRootMock.object)
                .verifiable(Times.once());
            shadowRootMock.setup(m => m.activeElement).returns(_ => shadowDomActiveElement);
            focusInCallbackMock
                .setup(callback => callback(shadowDomActiveElement))
                .verifiable(Times.once());
        }
    });
});
