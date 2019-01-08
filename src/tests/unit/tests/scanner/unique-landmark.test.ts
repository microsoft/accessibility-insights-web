// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { uniqueLandmarkConfiguration } from '../../../../scanner/unique-landmark';

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
        expect(uniqueLandmarkConfiguration.rule.helpUrl).toBe('/insights.html#/content/rules/uniqueLandmark');
    });

    it('should not match because not a landmark', () => {
        const node = document.createElement('h1');
        expect(uniqueLandmarkConfiguration.rule.matches(node, null)).toBe(false);
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
});
