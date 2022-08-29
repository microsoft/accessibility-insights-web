// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as AxeUtils from 'scanner/axe-utils';
import * as LabelInNameUtils from 'scanner/label-in-name-utils';
import { getVirtualNode } from 'scanner/label-in-name-utils';

describe('LabelInNameUtils', () => {
    const linkId = 'my-link';
    const labelId = 'link-label';
    const url = 'https://www.example.com';
    const displayedText = 'Example';
    const mismatchAccessibleName = 'Something Else';
    const linkWithoutAccessibleName = `<a id="${linkId}" href="${url}">${displayedText}</a>`;
    const linkWithLabel = `<a id="${linkId}" href="${url}" aria-label="${displayedText}">${displayedText}</a>`;
    const linkWithLabelMismatch = `<a id="${linkId}" href="${url}" aria-label="${mismatchAccessibleName}">${displayedText}</a>`;
    const linkWithLabelledBy = `<span id="${labelId}">${displayedText}</span><a id="${linkId}" href="${url}" aria-labelledby="${labelId}">${displayedText}</a>`;
    const linkWithLabelledByMismatch = `<span id="${labelId}">${mismatchAccessibleName}</span><a id="${linkId}" href="${url}" aria-labelledby="${labelId}">${displayedText}</a>`;
    const nonLinkElement = `<span id="${linkId}">Hello</span>`;
    let fixture: HTMLElement;

    describe('getVirtualNode', () => {
        let testSubject: HTMLElement;
        beforeAll(() => {
            mockCanvasContext();
        });

        beforeEach(() => {
            fixture = createTestFixture('test-fixture', '');
            fixture.innerHTML = linkWithLabel;
            testSubject = fixture.querySelector(`#${linkId}`);
        });

        afterEach(() => {
            document.body.querySelector('#test-fixture').remove();
        });

        it('correctly creates a virtual node from the passed in node', () => {
            const result = AxeUtils.withAxeSetup(() =>
                LabelInNameUtils.getVirtualNode(testSubject),
            );
            expect(result.actualNode).toBe(testSubject);
        });
    });

    describe('labelInNameMatches', () => {
        beforeEach(() => {
            fixture = createTestFixture('test-fixture', '');
        });

        afterEach(() => {
            document.body.querySelector('#test-fixture').remove();
        });
        it.each`
            element                            | isMatch  | markdown
            ${'plain link'}                    | ${false} | ${linkWithoutAccessibleName}
            ${'link with label'}               | ${true}  | ${linkWithLabel}
            ${'link with label mismatch'}      | ${true}  | ${linkWithLabelMismatch}
            ${'link with labelledby'}          | ${true}  | ${linkWithLabelledBy}
            ${'link with labelledby mismatch'} | ${true}  | ${linkWithLabelledByMismatch}
            ${'non link element'}              | ${false} | ${nonLinkElement}
        `(`returns matches $isMatch for $element`, ({ isMatch, markdown }) => {
            fixture.innerHTML = markdown;
            const node: HTMLElement = fixture.querySelector(`#${linkId}`);
            const virtualNode = AxeUtils.withAxeSetup(() => getVirtualNode(node));
            const matches = AxeUtils.withAxeSetup(() =>
                LabelInNameUtils.labelInNameMatches(node, virtualNode),
            );

            expect(matches).toBe(isMatch);
        });

        it.each(['', 'x', 'i', 'X', '>', '!', '❤️'])(
            'does not match if visible text is missing or if visible text is detected to be symbolic: %s',
            visibleText => {
                fixture.innerHTML = `<a id="${linkId}" href=${url} aria-label="${mismatchAccessibleName}">${visibleText}</a>`;
                const node: HTMLElement = fixture.querySelector(`#${linkId}`);
                const virtualNode = AxeUtils.withAxeSetup(() => getVirtualNode(node));
                const matches = AxeUtils.withAxeSetup(() =>
                    LabelInNameUtils.labelInNameMatches(node, virtualNode),
                );
                expect(matches).toBe(false);
            },
        );
    });

    describe('getLabelInNameData', () => {
        beforeEach(() => {
            fixture = createTestFixture('test-fixture', '');
        });

        afterEach(() => {
            document.body.querySelector('#test-fixture').remove();
        });

        it.each`
            element                            | expectedResult | href    | markdown                      | accessibleName            | visibleText
            ${'plain link'}                    | ${true}        | ${url}  | ${linkWithoutAccessibleName}  | ${displayedText}          | ${displayedText}
            ${'link with label'}               | ${true}        | ${url}  | ${linkWithLabel}              | ${displayedText}          | ${displayedText}
            ${'link with label mismatch'}      | ${false}       | ${url}  | ${linkWithLabelMismatch}      | ${mismatchAccessibleName} | ${displayedText}
            ${'link with labelledby'}          | ${true}        | ${url}  | ${linkWithLabelledBy}         | ${displayedText}          | ${displayedText}
            ${'link with labelledby mismatch'} | ${false}       | ${url}  | ${linkWithLabelledByMismatch} | ${mismatchAccessibleName} | ${displayedText}
            ${'non link element'}              | ${true}        | ${null} | ${nonLinkElement}             | ${'Hello'}                | ${'Hello'}
        `(
            `returns the expected data for $element`,
            ({ markdown, expectedResult, href, accessibleName, visibleText }) => {
                fixture.innerHTML = markdown;
                const node: HTMLElement = fixture.querySelector(`#${linkId}`);
                const virtualNode = AxeUtils.withAxeSetup(() => getVirtualNode(node));

                const result = AxeUtils.withAxeSetup(() =>
                    LabelInNameUtils.getLabelInNameData(node, virtualNode),
                );
                expect(result.url).toEqual(href);
                expect(result.accessibleName).toEqual(accessibleName);
                expect(result.visibleText).toEqual(visibleText);
                expect(result.labelContainsVisibleText).toEqual(expectedResult);
            },
        );
    });

    function createTestFixture(id: string, content: string): HTMLCanvasElement {
        const testFixture: HTMLCanvasElement = document.createElement('canvas');
        testFixture.setAttribute('id', id);
        document.body.appendChild(testFixture);
        testFixture.innerHTML = content;
        return testFixture;
    }

    function mockCanvasContext() {
        // This is a workaround to allow us to get visibleText from a virtualNode without having
        // to install the canvas npm package. Checking for visibleText involves checking for
        // icon ligature, which uses canvas context to determine if a special font is used. jsdom does
        // not include canvas and causes an error if its methods are called in tests.
        HTMLCanvasElement.prototype.getContext = (contextId: string, options?: any): any => {
            const data = new Uint8ClampedArray(8);
            data.set([500], 1); // data must be nonzero for at least one pixel
            return {
                canvas: {} as HTMLCanvasElement,
                measureText: (text: string) => {
                    return { width: 10 };
                },
                getImageData: (sx, sy, sw, sh, settings?) => {
                    return { data };
                },
                clearRect: (x, y, w, h) => null,
                fillText: (text, x, y, maxWidth?) => null,
            } as CanvasRenderingContext2D;
        };
    }
});
