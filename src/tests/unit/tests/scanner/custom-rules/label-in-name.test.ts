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
    const linkWithoutAccessibleName = `<a id="${linkId}" href="www.example.com">Example</a>`;
    const linkWithLabel = `<a id="${linkId}" href="www.example.com" aria-label="Example">Example</a>`;
    const linkWithLabelMismatch = `<a id="${linkId}" href="www.example.com" aria-label="Something Else">Example</a>`;
    const linkWithLabelledBy = `<span id="${labelId}">Example</span><a id="${linkId}" href="www.example.com" aria-labelledby="${labelId}">Example</a>`;
    const linkWithLabelledByMismatch = `<span id="${labelId}">Something Else</span><a id="${linkId}" href="www.example.com" aria-labelledby="${labelId}">Example</a>`;
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
        const virtualNode = getVirtualNode(node);
        const matches = withAxeSetup(() =>
            labelInNameConfiguration.rule.matches(node, virtualNode),
        );

        if (isMatch) {
            expect(matches).toBeTruthy();
        } else {
            expect(matches).toBeFalsy();
        }
    });

    it.each`
        element                            | expectedResult | markdown                      | accessibleName      | visibleText
        ${'plain link'}                    | ${true}        | ${linkWithoutAccessibleName}  | ${'Example'}        | ${'Example'}
        ${'link with label'}               | ${true}        | ${linkWithLabel}              | ${'Example'}        | ${'Example'}
        ${'link with label mismatch'}      | ${false}       | ${linkWithLabelMismatch}      | ${'Something Else'} | ${'Example'}
        ${'link with labelledby'}          | ${true}        | ${linkWithLabelledBy}         | ${'Example'}        | ${'Example'}
        ${'link with labelledby mismatch'} | ${false}       | ${linkWithLabelledByMismatch} | ${'Something Else'} | ${'Example'}
        ${'non link element'}              | ${true}       | ${nonLinkElement}             | ${'Hello'}          | ${'Hello'}
    `(
        `creates the expected data object for $element`,
        ({ expectedResult, markdown, accessibleName, visibleText }) => {
            fixture.innerHTML = markdown;
            const node: HTMLElement = fixture.querySelector(`#${linkId}`);
            const virtualNode = getVirtualNode(node);

            const result = withAxeSetup(() =>
                labelInNameConfiguration.checks[0].evaluate.call(context, node, null, virtualNode),
            );
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
