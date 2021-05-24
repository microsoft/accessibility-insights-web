// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, Times } from 'typemoq';
import { IActionN } from 'typemoq/_all';
import { getDefaultFeatureFlagsWeb } from '../../../../../common/feature-flags';
import { WindowUtils } from '../../../../../common/window-utils';
import { ClientUtils } from '../../../../../injected/client-utils';
import { DialogRenderer } from '../../../../../injected/dialog-renderer';
import { HtmlElementAxeResults } from '../../../../../injected/scanner-utils';
import { ShadowUtils } from '../../../../../injected/shadow-utils';
import { DrawerInitData } from '../../../../../injected/visualization/drawer';
import { DrawerUtils } from '../../../../../injected/visualization/drawer-utils';
import { DrawerConfiguration, Formatter } from '../../../../../injected/visualization/formatter';
import { HighlightBoxDrawer } from '../../../../../injected/visualization/highlight-box-drawer';
import { NonTextComponentFormatter } from '../../../../../injected/visualization/non-text-component-formatter';
import { TestDocumentCreator } from '../../../common/test-document-creator';

describe('Drawer', () => {
    const defaultStyleStub: CSSStyleDeclaration = {
        overflowX: null,
        overflowY: null,
    } as CSSStyleDeclaration;
    const containerClass = 'drawer-test';
    let fakeDocument: Document;
    let clientUtilsMock: IMock<ClientUtils>;
    let shadowUtilsMock: IMock<ShadowUtils>;
    let shadowContainer: HTMLElement;
    let windowStub: Window;
    let windowUtilsMock: IMock<WindowUtils>;
    beforeEach(() => {
        fakeDocument = TestDocumentCreator.createTestDocument();
        clientUtilsMock = Mock.ofType(ClientUtils);
        windowStub = { stubWindow: true } as any;
        windowUtilsMock = Mock.ofType(WindowUtils);
        shadowContainer = fakeDocument.createElement('div');

        shadowUtilsMock = Mock.ofType(ShadowUtils);
        shadowUtilsMock.setup(x => x.getShadowContainer()).returns(() => shadowContainer);
    });

    test('eraseLayout called when initialize', () => {
        const eraseLayoutMock = Mock.ofInstance(() => {});
        eraseLayoutMock.setup(e => e()).verifiable(Times.once());

        const testSubject = createDrawerBuilder().build();

        (testSubject as any).eraseLayout = eraseLayoutMock.object;
        testSubject.initialize({ data: [], featureFlagStoreData: getDefaultFeatureFlagsWeb() });

        eraseLayoutMock.verifyAll();
    });

    test('verifyDefaultStyling', async () => {
        fakeDocument.body.innerHTML = `
            <div id='id1'></div>
            <div id='id2'></div>
        `;

        windowUtilsMock
            .setup(it => it.getComputedStyle(It.isAny()))
            .returns(() => {
                return defaultStyleStub;
            })
            .verifiable(Times.atLeastOnce());

        const elementResults = createElementResults(['#id1', '#id2']);

        const testSubject = createDrawerBuilder()
            .setDomAndDrawerUtils(fakeDocument)
            .setWindowUtils(windowUtilsMock.object)
            .setDrawerUtils(getDrawerUtilsMock(fakeDocument).object)
            .build();

        testSubject.initialize(createDrawerInfo(elementResults));
        expect(testSubject.isOverlayEnabled).toEqual(false);

        await testSubject.drawLayout();

        expect(testSubject.isOverlayEnabled).toEqual(true);
        const overlays = findCurrentDrawerOverlays();

        expect(overlays.length).toEqual(2);
        overlays.forEach(overlay => {
            verifyOverlayStyle(overlay);
        });
        windowUtilsMock.verifyAll();
    });

    test('verifyDefaultStyling: visualizations fully visible in client view', async () => {
        const domMock: IMock<Document> = Mock.ofInstance({
            querySelectorAll: selector => {
                return null;
            },
            createElement: selector => {
                return null;
            },
            documentElement: {
                scrollWidth: 1000,
                scrollHeight: 1000,
                clientWidth: 1000,
                clientHeight: 1000,
            },
            body: {
                scrollWidth: 1000,
                scrollHeight: 1000,
            },
            querySelector: selector => {
                return null;
            },
            appendChild: node => {},
        } as any);

        const shadowContainerMock: IMock<HTMLElement> = Mock.ofInstance({
            appendChild: child => {},
        } as any);

        shadowContainer = shadowContainerMock.object;

        const bodyStub: HTMLBodyElement = {
            scrollHeight: 1000,
            scrollWidth: 1000,
        } as any;
        const elementStub: Element = {
            clientWidth: 50,
            clientHeight: 50,
            getBoundingClientRect: () => {
                return {
                    left: 10,
                    right: 60,
                    width: 50,
                    height: 50,
                    top: 10,
                    bottom: 60,
                };
            },
        } as any;
        const elementResults = createElementResults(['#id1']);

        domMock
            .setup(it => it.querySelectorAll('#id1'))
            .returns(selector => {
                return [elementStub] as any;
            })
            .verifiable();

        domMock
            .setup(it => it.createElement('div'))
            .returns(selector => {
                return document.createElement(selector);
            })
            .verifiable(Times.exactly(3));

        domMock
            .setup(it => it.querySelector('body'))
            .returns(stuff => {
                return bodyStub;
            });

        shadowContainerMock
            .setup(it =>
                it.appendChild(
                    It.is((wrapper: HTMLElement) => {
                        const child = wrapper.childNodes[0] as HTMLElement;
                        return (
                            child.style != null &&
                            child.style.minWidth === '50px' &&
                            child.style.minHeight === '50px' &&
                            child.style.top === '10px' &&
                            child.style.left === '10px'
                        );
                    }),
                ),
            )
            .verifiable();

        clientUtilsMock
            .setup(cu => cu.getOffsetFromBoundingRect(elementStub.getBoundingClientRect()))
            .returns(el => {
                return { left: 10, top: 10 };
            });

        windowUtilsMock
            .setup(it => it.getComputedStyle(bodyStub))
            .returns(stuff => {
                return {
                    overflowX: null,
                    overflowY: null,
                } as any;
            })
            .verifiable();

        windowUtilsMock
            .setup(it => it.getComputedStyle(domMock.object.documentElement as any))
            .returns(stuff => {
                return {
                    overflowX: null,
                    overflowY: null,
                } as any;
            })
            .verifiable();

        const testSubject = createDrawerBuilder()
            .setDomAndDrawerUtils(domMock.object)
            .setClientUtils(clientUtilsMock.object)
            .setWindowUtils(windowUtilsMock.object)
            .build();

        testSubject.initialize(createDrawerInfo(elementResults));
        await testSubject.drawLayout();

        domMock.verifyAll();
        windowUtilsMock.verifyAll();
        shadowContainerMock.verifyAll();
    });

    test('verifyDefaultStyling: visualizations not fully visible in client view', async () => {
        const formatterMock: IMock<NonTextComponentFormatter> =
            Mock.ofType(NonTextComponentFormatter);

        const domMock: IMock<Document> = Mock.ofInstance({
            querySelectorAll: selector => {
                return null;
            },
            createElement: selector => {
                return null;
            },
            documentElement: {
                scrollWidth: 1000,
                scrollHeight: 1000,
                clientWidth: 1000,
                clientHeight: 1000,
            },
            body: {
                scrollWidth: 1000,
                scrollHeight: 1000,
            },
            querySelector: selector => {
                return null;
            },
            appendChild: node => {},
        } as any);

        const shadowContainerMock: IMock<HTMLElement> = Mock.ofInstance({
            appendChild: child => {},
        } as any);

        shadowContainer = shadowContainerMock.object;

        const bodyStub: HTMLBodyElement = {
            scrollHeight: 1000,
            scrollWidth: 1000,
        } as any;
        const elementStub: Element = {
            clientWidth: 2000,
            clientHeight: 2000,
            getBoundingClientRect: () => {
                return {
                    left: 0,
                    right: 2000,
                    width: 2000,
                    height: 2000,
                    top: 0,
                    bottom: 2000,
                };
            },
        } as any;
        const boundingRect: ClientRect = {
            left: 0,
            right: 2003,
            width: 2006,
            height: 2006,
            top: 0,
            bottom: 2003,
        };
        const configStub: DrawerConfiguration = {
            borderColor: 'rgb(255, 255, 255)',
            textBoxConfig: {
                fontColor: 'rgb(255, 255, 255)',
                background: '#FFFFFF',
                text: null,
                boxWidth: '2em',
            },
            outlineStyle: 'solid',
            showVisualization: true,
            getBoundingRect: () => boundingRect,
        };
        formatterMock
            .setup(fm => fm.getDrawerConfiguration(elementStub as HTMLElement, It.isAny()))
            .returns(() => {
                return configStub;
            })
            .verifiable(Times.once());

        const elementResults = createElementResults(['#id1']);

        domMock
            .setup(it => it.querySelectorAll('#id1'))
            .returns(selector => {
                return [elementStub] as any;
            })
            .verifiable();

        domMock
            .setup(it => it.createElement('div'))
            .returns(selector => {
                return document.createElement(selector);
            })
            .verifiable(Times.exactly(3));

        domMock
            .setup(it => it.querySelector('body'))
            .returns(stuff => {
                return bodyStub;
            });

        shadowContainerMock
            .setup(it =>
                it.appendChild(
                    It.is((wrapper: HTMLElement) => {
                        const child = wrapper.childNodes[0] as HTMLElement;
                        return (
                            child.style != null &&
                            child.style.minWidth === '990px' &&
                            child.style.minHeight === '990px' &&
                            child.style.top === '5px' &&
                            child.style.left === '5px'
                        );
                    }),
                ),
            )
            .verifiable();

        clientUtilsMock
            .setup(cu => cu.getOffsetFromBoundingRect(boundingRect))
            .returns(_ => {
                return { left: 0, top: 0 };
            });

        windowUtilsMock
            .setup(it => it.getComputedStyle(bodyStub))
            .returns(stuff => {
                return {
                    overflowX: null,
                    overflowY: null,
                } as any;
            })
            .verifiable();

        windowUtilsMock
            .setup(it => it.getComputedStyle(domMock.object.documentElement as any))
            .returns(stuff => {
                return {
                    overflowX: null,
                    overflowY: null,
                } as any;
            })
            .verifiable();

        const testSubject = createDrawerBuilder()
            .setDomAndDrawerUtils(domMock.object)
            .setWindowUtils(windowUtilsMock.object)
            .setClientUtils(clientUtilsMock.object)
            .setFormatter(formatterMock.object)
            .build();

        testSubject.initialize(createDrawerInfo(elementResults));
        await testSubject.drawLayout();

        domMock.verifyAll();
        formatterMock.verifyAll();
        shadowContainerMock.verifyAll();
        windowUtilsMock.verifyAll();
    });

    test('verifyDefaultStyling: visualizations fully not visible in client view', async () => {
        const domMock: IMock<Document> = Mock.ofInstance({
            querySelectorAll: selector => {
                return null;
            },
            createElement: selector => {
                return null;
            },
            documentElement: {
                scrollWidth: 5,
                scrollHeight: 5,
                clientWidth: 5,
                clientHeight: 5,
            },
            body: {
                scrollWidth: 5,
                scrollHeight: 5,
            },
            querySelector: selector => {
                return null;
            },
            appendChild: node => {},
        } as any);

        const shadowContainerMock: IMock<HTMLElement> = Mock.ofInstance({
            appendChild: child => {},
        } as any);

        shadowContainer = shadowContainerMock.object;

        const bodyStub: HTMLBodyElement = {
            scrollHeight: 5,
            scrollWidth: 5,
        } as any;

        const elementStub: Element = {
            clientWidth: 50,
            clientHeight: 50,
            getBoundingClientRect: () => {
                return {
                    left: 10,
                    right: 60,
                    width: 50,
                    height: 50,
                    top: 10,
                    bottom: 60,
                };
            },
        } as any;

        const elementResults = createElementResults(['#id1']);

        domMock
            .setup(it => it.createElement(It.isAny()))
            .returns(() => {
                return document.createElement('div');
            })
            .verifiable();

        domMock
            .setup(it => it.querySelectorAll('#id1'))
            .returns(selector => {
                return [elementStub] as any;
            })
            .verifiable();

        domMock
            .setup(it => it.querySelector('body'))
            .returns(stuff => {
                return bodyStub;
            });

        shadowContainerMock.setup(it => it.appendChild(It.isAny())).verifiable();

        clientUtilsMock
            .setup(cu => cu.getOffsetFromBoundingRect(elementStub.getBoundingClientRect()))
            .returns(_ => {
                return { left: 10, top: 10 };
            });

        windowUtilsMock
            .setup(it => it.getComputedStyle(bodyStub))
            .returns(_ => {
                return {
                    overflowX: null,
                    overflowY: null,
                } as any;
            })
            .verifiable();

        windowUtilsMock
            .setup(it => it.getComputedStyle(domMock.object.documentElement as any))
            .returns(stuff => {
                return {
                    overflowX: null,
                    overflowY: null,
                } as any;
            })
            .verifiable();

        const testSubject = createDrawerBuilder()
            .setDomAndDrawerUtils(domMock.object)
            .setWindowUtils(windowUtilsMock.object)
            .setClientUtils(clientUtilsMock.object)
            .build();

        testSubject.initialize(createDrawerInfo(elementResults));
        await testSubject.drawLayout();

        domMock.verifyAll();
        shadowContainerMock.verifyAll();
        windowUtilsMock.verifyAll();
    });

    test('verifyDefaultStyling: visualizations not fully visible in client view when body/html overflowX is hidden', async () => {
        const domMock: IMock<Document> = Mock.ofInstance({
            querySelectorAll: selector => {
                return null;
            },
            createElement: selector => {
                return null;
            },
            documentElement: {
                scrollWidth: 1000,
                scrollHeight: 1000,
                clientWidth: 500,
                clientHeight: 1000,
            },
            body: {
                scrollWidth: 1000,
                scrollHeight: 1000,
            },
            querySelector: selector => {
                return null;
            },
            appendChild: node => {},
        } as any);

        const shadowContainerMock: IMock<HTMLElement> = Mock.ofInstance({
            appendChild: child => {},
        } as any);

        shadowContainer = shadowContainerMock.object;

        const bodyStub: HTMLBodyElement = {
            scrollHeight: 1000,
            scrollWidth: 1000,
        } as any;

        const elementStub: Element = {
            clientWidth: 2000,
            clientHeight: 2000,
            getBoundingClientRect: () => {
                return {
                    left: 0,
                    right: 2000,
                    width: 2000,
                    height: 2000,
                    top: 0,
                    bottom: 2000,
                };
            },
        } as any;

        const elementResults = createElementResults(['#id1']);

        domMock
            .setup(it => it.querySelectorAll('#id1'))
            .returns(selector => {
                return [elementStub] as any;
            })
            .verifiable();

        domMock
            .setup(it => it.createElement('div'))
            .returns(selector => {
                return document.createElement(selector);
            })
            .verifiable(Times.exactly(3));

        domMock
            .setup(it => it.querySelector('body'))
            .returns(stuff => {
                return bodyStub;
            });

        shadowContainerMock
            .setup(it =>
                it.appendChild(
                    It.is((wrapper: HTMLElement) => {
                        const child = wrapper.childNodes[0] as HTMLElement;
                        return (
                            child.style != null &&
                            child.style.minWidth === '490px' &&
                            child.style.minHeight === '990px' &&
                            child.style.top === '5px' &&
                            child.style.left === '5px'
                        );
                    }),
                ),
            )
            .verifiable();

        clientUtilsMock
            .setup(cu => cu.getOffsetFromBoundingRect(elementStub.getBoundingClientRect()))
            .returns(element => {
                return { left: 0, top: 0 };
            });

        windowUtilsMock
            .setup(it => it.getComputedStyle(bodyStub))
            .returns(stuff => {
                return {
                    overflowX: null,
                    overflowY: null,
                } as any;
            })
            .verifiable();

        windowUtilsMock
            .setup(it => it.getComputedStyle(domMock.object.documentElement as any))
            .returns(stuff => {
                return {
                    overflowX: 'hidden',
                    overflowY: null,
                } as any;
            })
            .verifiable();

        const testSubject = createDrawerBuilder()
            .setDomAndDrawerUtils(domMock.object)
            .setClientUtils(clientUtilsMock.object)
            .setWindowUtils(windowUtilsMock.object)
            .build();

        testSubject.initialize(createDrawerInfo(elementResults));
        await testSubject.drawLayout();

        domMock.verifyAll();
        shadowContainerMock.verifyAll();
        windowUtilsMock.verifyAll();
    });

    test('verifyDefaultStyling: visualizations not fully visible in client view when body/html overflowY is hidden', async () => {
        const domMock: IMock<Document> = Mock.ofInstance({
            querySelectorAll: selector => {
                return null;
            },
            createElement: selector => {
                return null;
            },
            documentElement: {
                scrollWidth: 1000,
                scrollHeight: 1000,
                clientWidth: 1000,
                clientHeight: 500,
            },
            body: {
                scrollWidth: 1000,
                scrollHeight: 1000,
            },
            querySelector: selector => {
                return null;
            },
            appendChild: node => {},
        } as any);

        const shadowContainerMock: IMock<HTMLElement> = Mock.ofInstance({
            appendChild: child => {},
        } as any);

        shadowContainer = shadowContainerMock.object;

        const bodyStub: HTMLBodyElement = {
            scrollHeight: 1000,
            scrollWidth: 1000,
        } as any;
        const elementStub: Element = {
            clientWidth: 2000,
            clientHeight: 2000,
            getBoundingClientRect: () => {
                return {
                    left: 0,
                    right: 2000,
                    width: 2000,
                    height: 2000,
                    top: 0,
                    bottom: 2000,
                };
            },
        } as any;

        const elementResults = createElementResults(['#id1']);

        domMock
            .setup(it => it.querySelectorAll('#id1'))
            .returns(selector => {
                return [elementStub] as any;
            })
            .verifiable();

        domMock
            .setup(it => it.createElement('div'))
            .returns(selector => {
                return document.createElement(selector);
            })
            .verifiable(Times.exactly(3));

        domMock
            .setup(it => it.querySelector('body'))
            .returns(stuff => {
                return bodyStub;
            });

        shadowContainerMock
            .setup(it =>
                it.appendChild(
                    It.is((wrapper: HTMLElement) => {
                        const child = wrapper.childNodes[0] as HTMLElement;
                        return (
                            child.style != null &&
                            child.style.minWidth === '990px' &&
                            child.style.minHeight === '490px' &&
                            child.style.top === '5px' &&
                            child.style.left === '5px'
                        );
                    }),
                ),
            )
            .verifiable();

        clientUtilsMock
            .setup(cu => cu.getOffsetFromBoundingRect(elementStub.getBoundingClientRect()))
            .returns(_ => {
                return { left: 0, top: 0 };
            });

        windowUtilsMock
            .setup(it => it.getComputedStyle(bodyStub))
            .returns(stuff => {
                return {
                    overflowX: null,
                    overflowY: null,
                } as any;
            })
            .verifiable();

        windowUtilsMock
            .setup(it => it.getComputedStyle(domMock.object.documentElement as any))
            .returns(stuff => {
                return {
                    overflowX: null,
                    overflowY: 'hidden',
                } as any;
            })
            .verifiable();

        const testSubject = createDrawerBuilder()
            .setDomAndDrawerUtils(domMock.object)
            .setClientUtils(clientUtilsMock.object)
            .setWindowUtils(windowUtilsMock.object)
            .build();

        testSubject.initialize(createDrawerInfo(elementResults));
        await testSubject.drawLayout();

        domMock.verifyAll();
        shadowContainerMock.verifyAll();
        windowUtilsMock.verifyAll();
    });

    test('verify createContainerElement not called if containerElement already exists', () => {
        const domMock: IMock<Document> = Mock.ofInstance({
            querySelectorAll: selector => {
                return null;
            },
            createElement: selector => {
                return null;
            },
            documentElement: {
                scrollWidth: 1000,
                scrollHeight: 1000,
                clientWidth: 500,
                clientHeight: 1000,
            },
            body: {
                scrollWidth: 1000,
                scrollHeight: 1000,
            },
            querySelector: selector => {
                return null;
            },
            appendChild: node => {},
        } as any);

        const testSubject = createDrawerBuilder()
            .setDomAndDrawerUtils(domMock.object)
            .setWindowUtils(windowUtilsMock.object)
            .build();

        (testSubject as any).containerElement = true;
        const createContainerElementMock = Mock.ofInstance(() => {});
        createContainerElementMock.setup(c => c()).verifiable(Times.never());
        (testSubject as any).createContainerElementMock = createContainerElementMock;

        createContainerElementMock.verifyAll();
    });

    test('verifyListenersSetupOnDraw', async () => {
        fakeDocument.body.innerHTML = "<div id='id1'></div>";

        setupGetComputedStyleCalled();

        const elementResults = createElementResults(['#id1']);

        const testSubject = createDrawerBuilder()
            .setDomAndDrawerUtils(fakeDocument)
            .setWindowUtils(windowUtilsMock.object)
            .build();

        testSubject.initialize(createDrawerInfo(elementResults));
        expect(testSubject.isOverlayEnabled).toEqual(false);
        const callbacks: any[] = [];
        const registerHandlerFunc: typeof windowUtilsMock.object.addEventListener = (
            window,
            eventName,
            handler,
            useCapture,
        ) => callbacks.push(handler);

        // draw
        windowUtilsMock.reset();
        setupWindow();
        setupGetComputedStyleCalled();
        setupAddEventListerCalled(registerHandlerFunc);
        setupRemoveEventListerNotCalled();
        await testSubject.drawLayout();

        windowUtilsMock.verifyAll();

        // erase
        windowUtilsMock.reset();
        setupWindow();
        setupAddEventListerNotCalled();
        setupRemoveEventListerCalled();

        testSubject.eraseLayout();

        windowUtilsMock.verifyAll();
        callbacks.forEach(cb => expect(cb).toEqual(callbacks[0]));
    });

    test('verifyListenersSetupOnErase', () => {
        fakeDocument.body.innerHTML = "<div id='id1'></div>";

        setupWindow();
        setupGetComputedStyleNotCalled();

        const elementResults = createElementResults(['#id1']);

        const testSubject = createDrawerBuilder()
            .setDomAndDrawerUtils(fakeDocument)
            .setWindowUtils(windowUtilsMock.object)
            .build();

        testSubject.initialize(createDrawerInfo(elementResults));
        expect(testSubject.isOverlayEnabled).toEqual(false);

        // erase
        windowUtilsMock.reset();
        setupWindow();
        setupRemoveEventListerCalled();
        setupAddEventListerNotCalled();

        testSubject.eraseLayout();

        windowUtilsMock.verifyAll();
    });

    describe('verifyScrollHandlerExecution', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });
        afterEach(() => {
            jest.useRealTimers();
        });

        test.each([true, false])(`throttle timeout expired: %p`, async throttleTimeoutExpired => {
            let drawCalledTimes = 1;
            fakeDocument.body.innerHTML = "<div id='id1'></div>";

            setupGetComputedStyleCalled();

            const elementResults = createElementResults(['#id1']);
            const testSubject = createDrawerBuilder()
                .setDomAndDrawerUtils(fakeDocument)
                .setWindowUtils(windowUtilsMock.object)
                .build();

            testSubject.initialize(createDrawerInfo(elementResults));
            expect(testSubject.isOverlayEnabled).toEqual(false);
            let scrollCallback: Function;
            const registerHandlerFunc: typeof windowUtilsMock.object.addEventListener = (
                window,
                eventName,
                handler,
                useCapture,
            ) => (scrollCallback = handler);

            setupWindow();
            setupAddEventListerCalled(registerHandlerFunc);

            // draw
            await testSubject.drawLayout();

            const drawMock = Mock.ofInstance(() => {});
            (testSubject as any).draw = drawMock.object;

            scrollCallback();
            if (throttleTimeoutExpired) {
                // Following call should not be throttled; draw is called again.
                jest.runAllTimers();
                drawCalledTimes = 2;
            }
            scrollCallback();

            drawMock.setup(draw => draw()).verifiable(Times.exactly(drawCalledTimes));

            drawMock.verifyAll();
            windowUtilsMock.verifyAll();
        });
    });

    test('verifyDrawsOnlyOnceWhenEnabled', async () => {
        fakeDocument.body.innerHTML = "<div id='id1'></div>";

        setupGetComputedStyleCalled();

        const elementResults = createElementResults(['#id1']);
        const testSubject = createDrawerBuilder()
            .setDomAndDrawerUtils(fakeDocument)
            .setWindowUtils(windowUtilsMock.object)
            .build();

        testSubject.initialize(createDrawerInfo(elementResults));
        expect(testSubject.isOverlayEnabled).toEqual(false);

        setupWindow();

        const drawMock = Mock.ofInstance(() => {});
        drawMock.setup(draw => draw()).verifiable(Times.once());
        (testSubject as any).draw = drawMock.object;

        testSubject.eraseLayout();
        await testSubject.drawLayout();

        drawMock.verifyAll();
    });

    test('verifyWhenElementResultsIsEmpty', async () => {
        fakeDocument.body.innerHTML = "<div id='id1'></div>";
        const elementResults = [];

        windowUtilsMock
            .setup(it => it.getComputedStyle(It.isAny()))
            .returns(stuff => {
                return {
                    overflowX: null,
                    overflowY: null,
                } as any;
            })
            .verifiable(Times.never());

        const testSubject = createDrawerBuilder()
            .setDomAndDrawerUtils(fakeDocument)
            .setWindowUtils(windowUtilsMock.object)
            .build();

        testSubject.initialize(createDrawerInfo(elementResults));
        expect(testSubject.isOverlayEnabled).toEqual(false);

        await testSubject.drawLayout();
        await testSubject.drawLayout();

        expect(testSubject.isOverlayEnabled).toEqual(true);
        const overlays = findCurrentDrawerOverlays();

        expect(overlays.length).toEqual(0);
        windowUtilsMock.verifyAll();
    });

    test('verifyWhenNoElementsFoundForSelectors', async () => {
        fakeDocument.body.innerHTML = "<div id='id1'></div>";

        windowUtilsMock
            .setup(it => it.getComputedStyle(It.isAny()))
            .returns(stuff => {
                return {
                    overflowX: null,
                    overflowY: null,
                } as any;
            })
            .verifiable(Times.never());

        const elementResults = createElementResults(['#id2']);

        const testSubject = createDrawerBuilder()
            .setDomAndDrawerUtils(fakeDocument)
            .setWindowUtils(windowUtilsMock.object)
            .build();

        testSubject.initialize(createDrawerInfo(elementResults));
        expect(testSubject.isOverlayEnabled).toEqual(false);

        await testSubject.drawLayout();

        expect(testSubject.isOverlayEnabled).toEqual(true);
        const overlays = findCurrentDrawerOverlays();

        expect(overlays.length).toEqual(0);
        windowUtilsMock.verifyAll();
    });

    test('verifyRemoveLayout', async () => {
        fakeDocument.body.innerHTML = `
            <div id='id1'></div>
            <div id='id2'></div>
        `;

        setupWindow();
        setupGetComputedStyleCalled();

        const elementResults = createElementResults(['#id1', '#id2']);

        const testSubject = createDrawerBuilder()
            .setDomAndDrawerUtils(fakeDocument)
            .setWindowUtils(windowUtilsMock.object)
            .build();

        testSubject.initialize(createDrawerInfo(elementResults));

        const anotherDrawer = createDrawerBuilder()
            .setContainerClass('anotherDrawer')
            .setDomAndDrawerUtils(fakeDocument)
            .setWindowUtils(windowUtilsMock.object)
            .build();

        anotherDrawer.initialize(createDrawerInfo(elementResults));

        await anotherDrawer.drawLayout();
        expect(findAllOverlayContainers().length).toEqual(1);

        await testSubject.drawLayout();

        expect(findAllOverlayContainers().length).toEqual(2);
        testSubject.eraseLayout();

        expect(testSubject.isOverlayEnabled).toEqual(false);
        const overlays = findCurrentDrawerOverlays();

        expect(overlays.length).toEqual(0);
        expect(findAllOverlayContainers().length).toEqual(1);
        windowUtilsMock.verifyAll();
    });

    test('verifyRedraw', async () => {
        fakeDocument.body.innerHTML = `
            <div id='id1'></div>
            <div id='id2'></div>
        `;

        const elementResults = createElementResults(['#id1', '#id2']);

        windowUtilsMock
            .setup(it => it.getComputedStyle(It.isAny()))
            .returns(() => {
                return defaultStyleStub;
            })
            .verifiable(Times.atLeastOnce());

        const testSubject = createDrawerBuilder()
            .setDomAndDrawerUtils(fakeDocument)
            .setWindowUtils(windowUtilsMock.object)
            .setDrawerUtils(getDrawerUtilsMock(fakeDocument).object)
            .build();

        testSubject.initialize(createDrawerInfo(elementResults));

        const anotherDrawer = createDrawerBuilder()
            .setContainerClass('anotherDrawer')
            .setDomAndDrawerUtils(fakeDocument)
            .setWindowUtils(windowUtilsMock.object)
            .build();
        anotherDrawer.initialize(createDrawerInfo(elementResults));

        // draw with another drawer
        await anotherDrawer.drawLayout();
        expect(findAllOverlayContainers().length).toEqual(1);

        // draw first time
        expect(testSubject.isOverlayEnabled).toEqual(false);
        await testSubject.drawLayout();
        expect(testSubject.isOverlayEnabled).toEqual(true);
        expect(findAllOverlayContainers().length).toEqual(2);

        // redraw
        await testSubject.drawLayout();
        expect(testSubject.isOverlayEnabled).toEqual(true);
        expect(findAllOverlayContainers().length).toEqual(2);

        const overlays = findCurrentDrawerOverlays();

        windowUtilsMock.verifyAll();
        expect(overlays.length).toEqual(4);
        overlays.forEach(overlay => {
            verifyOverlayStyle(overlay);
        });
    });

    test('verifyFormatter', async () => {
        fakeDocument.body.innerHTML = `
            <div id='id1'></div>
            <div id='id2'></div>
            <div id='id3'></div>
            <div id='id4'></div>
        `;

        const element1Config: DrawerConfiguration = {
            borderColor: 'rgb(12, 13, 14)',
            textBoxConfig: {
                fontColor: 'rgb(100, 200, 0)',
                text: 'element 1 text',
                background: 'rgb(12, 13, 14)',
            },
            toolTip: 'element 1 tooltip',
            outlineStyle: 'solid',
            showVisualization: true,
        };

        const element2Config: DrawerConfiguration = {
            textBoxConfig: {
                fontColor: 'rgb(0, 100, 0)',
                text: 'element 2 text',
                background: 'rgb(10, 1, 15)',
            },
            borderColor: 'rgb(10, 1, 15)',
            toolTip: 'element 2 tooltip',
            outlineStyle: 'dashed',
            showVisualization: true,
        };

        const element3Config: DrawerConfiguration = {
            borderColor: 'rgb(12, 13, 14)',
            toolTip: 'element 3 tooltip',
            outlineStyle: 'solid',
            showVisualization: false,
        };

        const element4Config: DrawerConfiguration = {
            failureBoxConfig: {
                fontColor: 'rgb(100, 200, 0)',
                text: 'element 4 text',
                background: 'rgb(12, 13, 14)',
            },
            borderColor: 'rgb(12, 13, 14)',
            toolTip: 'element 4 tooltip',
            outlineStyle: 'solid',
            showVisualization: true,
        };

        class FormatterStub implements Formatter {
            public getDrawerConfiguration(el: Node, data): DrawerConfiguration {
                throw new Error('Not implemented');
            }

            public getDialogRenderer(): DialogRenderer {
                return null;
            }
        }
        const formatterMock = Mock.ofType(FormatterStub);

        windowUtilsMock
            .setup(wu => wu.getComputedStyle(It.isAny()))
            .returns(() => {
                return defaultStyleStub;
            })
            .verifiable(Times.atLeastOnce());

        const elementResults = createElementResults(['#id1', '#id2', '#id3', '#id4']);

        function addMockForElement(selector: string, config: DrawerConfiguration): void {
            const elementResult = elementResults.filter(el => el.target[0] === selector)[0];
            formatterMock
                .setup(it =>
                    it.getDrawerConfiguration(fakeDocument.querySelector(selector), elementResult),
                )
                .returns(() => config)
                .verifiable();
        }
        addMockForElement('#id1', element1Config);
        addMockForElement('#id2', element2Config);
        addMockForElement('#id3', element3Config);
        addMockForElement('#id4', element4Config);

        const testSubject = createDrawerBuilder()
            .setDomAndDrawerUtils(fakeDocument)
            .setFormatter(formatterMock.object)
            .setWindowUtils(windowUtilsMock.object)
            .setDrawerUtils(getDrawerUtilsMock(fakeDocument).object)
            .build();
        testSubject.initialize(createDrawerInfo(elementResults));

        await testSubject.drawLayout();

        expect(testSubject.isOverlayEnabled).toEqual(true);
        formatterMock.verifyAll();

        const overlays = findCurrentDrawerOverlays();

        expect(overlays.length).toEqual(3);

        windowUtilsMock.verifyAll();
        verifyOverlayStyle(overlays[0], element1Config);
        verifyOverlayStyle(overlays[1], element2Config);
        verifyOverlayStyle(overlays[2], element4Config);
    });

    function createDrawerInfo<T>(elementResults: T[]): DrawerInitData<T> {
        return {
            data: elementResults,
            featureFlagStoreData: getDefaultFeatureFlagsWeb(),
        };
    }

    function createElementResults(ids: string[]): HtmlElementAxeResults[] {
        return ids.map(id => {
            return {
                ruleResults: {},
                target: [id],
                targetIndex: 0,
            };
        });
    }

    function getDrawerUtilsMock(dom): IMock<DrawerUtils> {
        const drawerUtilsMock = Mock.ofType(DrawerUtils);
        drawerUtilsMock
            .setup(dm =>
                dm.isOutsideOfDocument(It.isAny(), dom, defaultStyleStub, defaultStyleStub),
            )
            .returns(() => false)
            .verifiable(Times.atLeastOnce());
        drawerUtilsMock
            .setup(dm => dm.getDocumentElement())
            .returns(() => dom)
            .verifiable(Times.atLeastOnce());
        drawerUtilsMock
            .setup(dm => dm.getContainerTopOffset(It.isAny()))
            .returns(() => 5)
            .verifiable(Times.atLeastOnce());
        drawerUtilsMock
            .setup(dm => dm.getContainerLeftOffset(It.isAny()))
            .returns(() => 5)
            .verifiable(Times.atLeastOnce());
        drawerUtilsMock
            .setup(dm =>
                dm.getContainerWidth(
                    It.isAny(),
                    dom,
                    It.isAnyNumber(),
                    defaultStyleStub,
                    defaultStyleStub,
                ),
            )
            .returns(() => 0)
            .verifiable(Times.atLeastOnce());
        drawerUtilsMock
            .setup(dm =>
                dm.getContainerHeight(
                    It.isAny(),
                    dom,
                    It.isAnyNumber(),
                    defaultStyleStub,
                    defaultStyleStub,
                ),
            )
            .returns(() => 0)
            .verifiable(Times.atLeastOnce());
        return drawerUtilsMock;
    }

    function verifyOverlayStyle(
        overlay: { container: HTMLDivElement; label: HTMLDivElement; failureLabel: HTMLDivElement },
        drawerConfig: DrawerConfiguration = HighlightBoxDrawer.defaultConfiguration,
    ): void {
        expect(overlay.container.style.outlineStyle).toEqual(drawerConfig.outlineStyle);
        expect(overlay.container.style.outlineColor).toEqual(drawerConfig.borderColor);
        expect(overlay.container.style.top).toEqual('5px');
        expect(overlay.container.style.left).toEqual('5px');
        expect(overlay.container.style.minHeight).toEqual('0px');
        expect(overlay.container.style.minWidth).toEqual('0px');
        expect(overlay.container.title).toEqual(drawerConfig.toolTip || '');
        expect(overlay.label.style.backgroundColor).toEqual(drawerConfig.borderColor);
        expect(overlay.label.style.textAlign).toEqual(drawerConfig.textAlign || '');
        expect(overlay.label.style.cursor).toEqual(drawerConfig.cursor || '');
        if (drawerConfig.textBoxConfig) {
            expect(overlay.label.innerText).toEqual(drawerConfig.textBoxConfig.text || '');
            expect(overlay.label.style.width).toEqual(drawerConfig.textBoxConfig.boxWidth || '');
            expect(overlay.label.style.color).toEqual(drawerConfig.textBoxConfig.fontColor);
            expect(overlay.label.className).toEqual('insights-highlight-text text-label');
        }
        if (drawerConfig.failureBoxConfig) {
            expect(overlay.label.innerText).toEqual(drawerConfig.failureBoxConfig.text || '');
            expect(overlay.label.style.width).toEqual(drawerConfig.failureBoxConfig.boxWidth || '');
            expect(overlay.label.style.color).toEqual(drawerConfig.failureBoxConfig.fontColor);
            expect(overlay.label.className).toEqual('insights-highlight-text failure-label');
        }
    }

    function findCurrentDrawerOverlays(): {
        container: HTMLDivElement;
        label: HTMLDivElement;
        failureLabel: HTMLDivElement;
    }[] {
        const overlays: {
            container: HTMLDivElement;
            label: HTMLDivElement;
            failureLabel: HTMLDivElement;
        }[] = [];
        const containers = shadowContainer.querySelectorAll(
            `.insights-container.insights-highlight-container.${containerClass} .insights-highlight-box`,
        );

        for (let containerPos = 0; containerPos < containers.length; containerPos++) {
            overlays.push({
                container: containers[containerPos] as HTMLDivElement,
                label: containers[containerPos].querySelector('div') as HTMLDivElement,
                failureLabel: containers[containerPos].querySelector(
                    '.failure-label',
                ) as HTMLDivElement,
            });
        }
        return overlays;
    }

    function findAllOverlayContainers(): NodeListOf<Element> {
        return shadowContainer.querySelectorAll('.insights-container');
    }

    class DrawerBuilder {
        private dom: Document;
        private containerClass: string = containerClass;
        private windowUtils: WindowUtils;
        private drawerUtils: DrawerUtils;
        private clientUtils: ClientUtils = new ClientUtils(window);
        private formatter: Formatter;

        constructor(private readonly shadowUtils: ShadowUtils) {
            this.shadowUtils = shadowUtils;
        }

        public setClientUtils(clientUtils: ClientUtils): DrawerBuilder {
            this.clientUtils = clientUtils;
            return this;
        }

        public setWindowUtils(windowUtils: WindowUtils): DrawerBuilder {
            this.windowUtils = windowUtils;
            return this;
        }

        public setDrawerUtils(drawerUtils: DrawerUtils): DrawerBuilder {
            this.drawerUtils = drawerUtils;
            return this;
        }

        public setDomAndDrawerUtils(dom: Document): DrawerBuilder {
            this.dom = dom;
            this.drawerUtils = new DrawerUtils(dom);
            return this;
        }

        public setContainerClass(cssClass: string): DrawerBuilder {
            this.containerClass = cssClass;
            return this;
        }

        public setFormatter(formatter: Formatter): DrawerBuilder {
            this.formatter = formatter;
            return this;
        }

        public build(): HighlightBoxDrawer {
            return new HighlightBoxDrawer(
                this.dom,
                this.containerClass,
                this.windowUtils,
                this.shadowUtils,
                this.drawerUtils,
                this.clientUtils,
                this.formatter,
            );
        }
    }

    function createDrawerBuilder(): DrawerBuilder {
        return new DrawerBuilder(shadowUtilsMock.object);
    }

    function setupWindow(): void {
        windowUtilsMock.setup(w => w.getWindow()).returns(() => windowStub);
    }

    function setupGetComputedStyleNotCalled(): void {
        windowUtilsMock.setup(it => it.getComputedStyle(It.isAny())).verifiable(Times.never());
    }

    function setupGetComputedStyleCalled(): void {
        windowUtilsMock
            .setup(it => it.getComputedStyle(It.isAny()))
            .returns(stuff => {
                return {
                    overflowX: null,
                    overflowY: null,
                } as any;
            })
            .verifiable(Times.atLeastOnce());
    }

    function setupRemoveEventListerCalled(): void {
        windowUtilsMock
            .setup(x => x.removeEventListener(windowStub, 'resize', It.isAny(), true))
            .verifiable();
        windowUtilsMock
            .setup(x => x.removeEventListener(windowStub, 'scroll', It.isAny(), true))
            .verifiable();
    }

    function setupRemoveEventListerNotCalled(): void {
        windowUtilsMock
            .setup(x => x.removeEventListener(windowStub, 'resize', It.isAny(), true))
            .verifiable(Times.never());
        windowUtilsMock
            .setup(x => x.removeEventListener(windowStub, 'scroll', It.isAny(), true))
            .verifiable(Times.never());
    }

    function setupAddEventListerCalled(callback: IActionN<any>): void {
        windowUtilsMock
            .setup(x => x.addEventListener(windowStub, 'resize', It.isAny(), true))
            .callback(callback)
            .verifiable();
        windowUtilsMock
            .setup(x => x.addEventListener(windowStub, 'scroll', It.isAny(), true))
            .callback(callback)
            .verifiable();
    }

    function setupAddEventListerNotCalled(): void {
        windowUtilsMock
            .setup(x => x.addEventListener(windowStub, 'resize', It.isAny(), It.isAny()))
            .verifiable(Times.never());
        windowUtilsMock
            .setup(x => x.addEventListener(windowStub, 'scroll', It.isAny(), It.isAny()))
            .verifiable(Times.never());
    }
});
