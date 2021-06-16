// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { withAxeSetup } from 'scanner/axe-utils';
import { uniqueLandmarkConfiguration } from 'scanner/custom-rules/unique-landmark';

describe('unique-landmark', () => {
    let fixture: HTMLElement;

    beforeEach(() => {
        fixture = document.createElement('div');
        fixture.setAttribute('id', 'test-fixture');
        document.body.appendChild(fixture);
    });

    afterEach(() => {
        document.body.querySelector('#test-fixture').remove();
    });

    it('returns correct url', () => {
        expect(uniqueLandmarkConfiguration.rule.helpUrl).toBe(
            '/insights.html#/content/rules/uniqueLandmark',
        );
    });

    it('should not match because not a landmark', () => {
        fixture.innerHTML = `<h1>header</h1>`;
        const node = fixture.querySelector(`h1`);
        const result = withAxeSetup(() => uniqueLandmarkConfiguration.rule.matches(node, null));
        expect(result).toBe(false);
    });

    it('should pass because is a landmark', () => {
        const node = document.createElement('div');
        node.setAttribute('role', 'banner');
        fixture.appendChild(node);
        expect(uniqueLandmarkConfiguration.rule.matches(node, null)).toBe(true);
    });

    it('should not match because landmark is hidden', () => {
        const node = document.createElement('div');
        node.setAttribute('role', 'banner');
        node.style.display = 'none';
        expect(uniqueLandmarkConfiguration.rule.matches(node, null)).toBe(false);
    });

    describe('form and section elements must have accessible names to be matched', () => {
        const elements = ['section', 'form'];

        elements.forEach(elementType => {
            it(`should match because it is a ${elementType} with a label`, () => {
                fixture.innerHTML = `<${elementType} aria-label="sample label">some ${elementType}</${elementType}>`;
                const node = fixture.querySelector(`${elementType}`);
                const result = withAxeSetup(() =>
                    uniqueLandmarkConfiguration.rule.matches(node, null),
                );
                expect(result).toEqual(true);
            });

            it(`should not match because it is a ${elementType} without a label`, () => {
                fixture.innerHTML = `<${elementType}>some ${elementType}</${elementType}>`;
                const node = fixture.querySelector(`${elementType}`);
                const result = withAxeSetup(() =>
                    uniqueLandmarkConfiguration.rule.matches(node, null),
                );
                expect(result).toEqual(false);
            });
        });
    });
});
