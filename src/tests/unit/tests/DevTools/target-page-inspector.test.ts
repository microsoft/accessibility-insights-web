// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TargetPageInspector } from 'Devtools/target-page-inspector';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('TargetPageInspector', () => {
    type InspectedWindow = typeof chrome.devtools.inspectedWindow;

    let inspectedWindowMock: IMock<InspectedWindow>;
    let testSubject: TargetPageInspector;

    type QuerySelector = typeof Document.prototype.querySelector;

    let querySelectorMock: IMock<QuerySelector>;
    let originalQuerySelector: QuerySelector;

    const testFrameUrl = 'test-frame-url';

    beforeEach(() => {
        originalQuerySelector = document.querySelector;

        querySelectorMock = Mock.ofType<QuerySelector>(undefined, MockBehavior.Strict);

        document.querySelector = querySelectorMock.object;

        inspectedWindowMock = Mock.ofType<InspectedWindow>();
        testSubject = new TargetPageInspector(inspectedWindowMock.object);
    });

    afterEach(() => {
        document.querySelector = originalQuerySelector;
    });

    const safeSelectors = [
        '#id-selector',
        '.class-selector',
        'article > p',
        'article h2',
        'article ~ h2',
        'article + h2',
        'li:last-child',
        'input:checked + label',
        'a[target]',
        'a[href*="login"]',
        'a[href^="https://"]',
        'a[href$=".pdf"]',
        'a[rel~="tag"]',
        'a[lang|="en"]',
        'li:nth-child(3n)',
        'div:not(.awesome)',
        'div::after',
        '#result;button',
    ];

    it.each(safeSelectors)(
        'calls eval through the inspected window, with safe selector = %s',
        safeSelector => {
            // we need to define a inspect function so we can actually evaluate the script
            function inspect(): void {
                // no op on purpose
            }

            querySelectorMock
                .setup(handler => handler(It.isAnyString()))
                .callback(selector => {
                    // using explicit expect yields better error messaging
                    // than just use setup with the safeSelector value
                    expect(selector).toEqual(safeSelector);
                });

            let actualScript: string;

            inspectedWindowMock
                .setup(inspected =>
                    inspected.eval(It.isAnyString(), It.isValue({ frameURL: testFrameUrl })),
                )
                .callback(script => {
                    actualScript = script;
                });

            testSubject.inspectElement(safeSelector, testFrameUrl);

            // we use eval to actually run the script
            // the mocks/fakes on this test will ensure the script will be evaluated properly
            const evaluator = () => {
                // tslint:disable-next-line: no-eval
                eval(actualScript);
            };

            expect(evaluator).not.toThrow();
        },
    );

    it('throws for a non string selector value', () => {
        const unsafeSelector = { description: 'this is not a string' } as any;

        const act = () => testSubject.inspectElement(unsafeSelector, testFrameUrl);

        inspectedWindowMock.verify(
            inspected => inspected.eval(It.isAny(), It.isAny()),
            Times.never(),
        );

        expect(act).toThrow('selector is not a string');
    });

    it('properly handles quotes', () => {
        const unsafeSelector = `body'); alert('xss`; // this is an attempt to run arbitrary js code

        const expectedScript =
            'inspect(document.querySelector(' + JSON.stringify(unsafeSelector) + '))';

        testSubject.inspectElement(unsafeSelector, testFrameUrl);

        inspectedWindowMock.verify(
            inspected => inspected.eval(expectedScript, { frameURL: testFrameUrl } as any),
            Times.once(),
        );
    });
});
