// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TargetPageInspector } from 'Devtools/target-page-inspector';
import { IMock, It, Mock, Times } from 'typemoq';

describe('TargetPageInspector', () => {
    type InspectedWindow = typeof chrome.devtools.inspectedWindow;

    let inspectedWindowMock: IMock<InspectedWindow>;
    let testSubject: TargetPageInspector;

    const testFrameUrl = 'test-frame-url';

    beforeEach(() => {
        inspectedWindowMock = Mock.ofType<InspectedWindow>();
        testSubject = new TargetPageInspector(inspectedWindowMock.object);
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

    it.each(safeSelectors)('calls eval on the target page with selector = %s', safeSelector => {
        const expectedScript =
            'inspect(document.querySelector(' + JSON.stringify(safeSelector) + '))';

        testSubject.inspectElement(safeSelector, testFrameUrl);

        inspectedWindowMock.verify(
            inspected => inspected.eval(expectedScript, { frameURL: testFrameUrl } as any),
            Times.once(),
        );
    });

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
