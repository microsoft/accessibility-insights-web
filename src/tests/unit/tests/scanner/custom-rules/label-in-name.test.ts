// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as axe from 'axe-core';
import { withAxeSetup } from 'scanner/axe-utils';
import { labelInNameConfiguration } from 'scanner/custom-rules/label-in-name';
import { getVirtualNode } from 'scanner/label-in-name-utils';

const fixture = createTestFixture('test-fixture', '');
const context = {
    _data: null,
    data: function (d: any): any {
        this._data = d;
    },
};

describe('label-in-name check', () => {
    it('check exists', () => {
        const check = axe._audit.checks['label-in-name'];
        expect(check).not.toBeNull();
    });
});

describe('label-in-name check', () => {
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
    beforeEach(() => {
        context._data = null;
    });

    afterEach(() => {
        axe.teardown();
    });

    it.each`
        element                            | isMatch  | markdown
        ${'plain link'}                    | ${false} | ${linkWithoutAccessibleName}
        ${'link with label'}               | ${true}  | ${linkWithLabel}
        ${'link with label mismatch'}      | ${true}  | ${linkWithLabelMismatch}
        ${'link with labelledby'}          | ${true}  | ${linkWithLabelledBy}
        ${'link with labelledby mismatch'} | ${true}  | ${linkWithLabelledByMismatch}
        ${'non link element'}              | ${false} | ${nonLinkElement}
    `(`selector selects $element: $isMatch`, ({ isMatch, markdown }) => {
        fixture.innerHTML = markdown;
        const nodes = fixture.querySelectorAll(labelInNameConfiguration.rule.selector);
        if (isMatch) {
            expect(nodes.length).toBe(1);
        } else {
            expect(nodes.length).toBe(0);
        }
    });

    it.each`
        element                            | isMatch  | markdown
        ${'plain link'}                    | ${false} | ${linkWithoutAccessibleName}
        ${'link with label'}               | ${true}  | ${linkWithLabel}
        ${'link with label mismatch'}      | ${true}  | ${linkWithLabelMismatch}
        ${'link with labelledby'}          | ${true}  | ${linkWithLabelledBy}
        ${'link with labelledby mismatch'} | ${true}  | ${linkWithLabelledByMismatch}
        ${'non link element'}              | ${false} | ${nonLinkElement}
    `(`returns $isMatch for $element`, ({ isMatch, markdown }) => {
        fixture.innerHTML = markdown;
        const node: HTMLElement = fixture.querySelector(`#${linkId}`);
        const virtualNode = withAxeSetup(() => getVirtualNode(node));
        const matches = withAxeSetup(() =>
            labelInNameConfiguration.rule.matches(node, virtualNode),
        );

        expect(matches).toBe(isMatch);
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
        `creates the expected data object for $element`,
        ({ markdown, expectedResult, href, accessibleName, visibleText }) => {
            fixture.innerHTML = markdown;
            const node: HTMLElement = fixture.querySelector(`#${linkId}`);
            const virtualNode = withAxeSetup(() => getVirtualNode(node));

            const result = withAxeSetup(() =>
                labelInNameConfiguration.checks[0].evaluate.call(context, node, null, virtualNode),
            );
            expect(context._data.url).toEqual(href);
            expect(context._data.accessibleName).toEqual(accessibleName);
            expect(context._data.visibleText).toEqual(visibleText);
            expect(context._data.labelInName).toEqual(expectedResult);

            expect(result).toBeTruthy(); // always returns true
        },
    );
});

function createTestFixture(id: string, content: string): HTMLDivElement {
    const testFixture: HTMLDivElement = document.createElement('div');
    testFixture.setAttribute('id', id);
    document.body.appendChild(testFixture);
    testFixture.innerHTML = content;
    return testFixture;
}
