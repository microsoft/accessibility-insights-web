// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { withAxeSetup } from 'scanner/axe-utils';
import { cssContentConfiguration } from 'scanner/custom-rules/css-content-rule';

describe('css-content rule', () => {
    it('should have correct props', () => {
        expect(cssContentConfiguration.rule.id).toBe('css-content');
        expect(cssContentConfiguration.rule.selector).toBe('body');
        expect(cssContentConfiguration.rule.any[0]).toBe('css-content');
        expect(cssContentConfiguration.rule.any.length).toBe(1);
        expect(cssContentConfiguration.checks[0].id).toBe('css-content');
        expect(cssContentConfiguration.checks[0].evaluate(null, null, null, null)).toBe(true);
    });

    describe('matches', () => {
        let divElementFixture: HTMLDivElement;
        let headingElementFixture: HTMLHeadingElement;

        let originalGetComputedStyle: typeof window.getComputedStyle;

        beforeEach(() => {
            divElementFixture = document.createElement('div');
            headingElementFixture = document.createElement('h1');
            divElementFixture.appendChild(headingElementFixture);
            document.body.appendChild(divElementFixture);

            // This is a workaround for JSDom not supporting getComputedStyle with pseudo elements.
            // This should be replaced by adding equivalent actual styles to document.head once
            // jsdom/jsdom#1928 is resolved.
            originalGetComputedStyle = window.getComputedStyle;
            window.getComputedStyle = (node, pseudo): CSSStyleDeclaration => {
                if (pseudo === ':before' && node.classList.contains('with-before-content')) {
                    return { content: 'content' } as CSSStyleDeclaration;
                }
                if (pseudo === ':after' && node.classList.contains('with-after-content')) {
                    return { content: 'content' } as CSSStyleDeclaration;
                }
                if (pseudo === ':before' || pseudo === ':after') {
                    // Browser behavior is to normalize to content: 'none' regardless of whether
                    // there is no :before style or an empty :before style
                    return { content: 'none' } as CSSStyleDeclaration;
                }

                return originalGetComputedStyle(node, pseudo);
            };
        });

        afterEach(() => {
            window.getComputedStyle = originalGetComputedStyle;
            document.body.innerHTML = '';
        });

        it.each`
            pseudoClass              | displayStyle | expectedResult
            ${null}                  | ${null}      | ${false}
            ${'with-before-empty'}   | ${null}      | ${false}
            ${'with-after-empty'}    | ${null}      | ${false}
            ${'with-before-content'} | ${'none'}    | ${false}
            ${'with-after-content'}  | ${'none'}    | ${false}
            ${'with-before-content'} | ${null}      | ${true}
            ${'with-after-content'}  | ${null}      | ${true}
        `(
            'returns $expectedResult for element with pseudoClass=$pseudoClass, displayStyle=$displayStyle',
            ({ pseudoClass, displayStyle, expectedResult }) => {
                if (displayStyle != null) {
                    headingElementFixture.style.display = displayStyle;
                }

                if (pseudoClass != null) {
                    headingElementFixture.classList.add(pseudoClass);
                }

                const result = withAxeSetup(() =>
                    cssContentConfiguration.rule.matches(divElementFixture, null),
                );

                expect(result).toBe(expectedResult);
            },
        );
    });
});
