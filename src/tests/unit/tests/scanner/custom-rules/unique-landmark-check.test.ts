// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { uniqueLandmarkConfiguration } from '../../../../../scanner/custom-rules/unique-landmark';

declare let axe;

describe('axe.Check: unique-landmark', () => {
    let check;
    let fixture;
    const checkContext = {
        _data: null,
        data: function (d: any): void {
            // tslint:disable-next-line:no-invalid-this
            this._data = d;
        },
    };
    beforeEach(() => {
        check = axe._audit.checks['unique-landmark'];

        fixture = createTestFixture('test-fixture', '');
        checkContext._data = null;
    });

    afterEach(() => {
        axe.teardown();
        fixture.remove();
    });

    it('check exist', () => {
        expect(check).not.toBeNull();
    });

    it('set role & label for landmark', () => {
        fixture.innerHTML = `
            <div role="banner" id="landmark1" aria-label="header landmark"></div>
            `;
        axe.setup(fixture);

        const node = fixture.querySelector('#landmark1');
        expectCheckTrue(node);
        expect(checkContext._data).toEqual({
            role: 'banner',
            label: 'header landmark',
        });
    });

    it('set role & label for html5 element', () => {
        fixture.innerHTML = `
            <div id="sectionLabel">section landmark</div>
            <section id="landmark1" aria-labelledby="sectionLabel"></section>
            `;
        axe.setup(fixture);

        const node = fixture.querySelector('#landmark1');
        expectCheckTrue(node);
        expect(checkContext._data).toEqual({
            role: 'region',
            label: 'section landmark',
        });
    });

    it('should exclude hidden landmarks for unique check', () => {
        fixture.innerHTML = `
            <div role="banner" id="landmark1" style="display:none">landmark1</div>
            <div role="banner" id="landmark2" aria-label="header landmark">landmark2</div>
            `;

        axe.setup(fixture);
        const node = fixture.querySelector('#landmark2');

        expectCheckTrue(node);
    });

    describe('duplicate label validation', () => {
        let duplicateLandmark1: Element;
        let duplicateLandmark2: Element;
        let uniqueLandmark: Element;

        beforeEach(() => {
            fixture.innerHTML = `
            <div role="banner" id="landmark1" aria-label="duplicate">landmark1</div>
            <div role="banner" id="landmark2" aria-label="duplicate">landmark2</div>
            <div role="banner" id="landmark3" aria-label="some other landmark">landmark3</div>
            `;

            axe.setup(fixture);
            duplicateLandmark1 = fixture.querySelector('#landmark1');
            duplicateLandmark2 = fixture.querySelector('#landmark2');
            uniqueLandmark = fixture.querySelector('#landmark3');
        });

        it('false for duplicate landmark', () => {
            expectCheckFalse(duplicateLandmark1);
            expectCheckFalse(duplicateLandmark2);
        });

        it('true for unique landmark', () => {
            expectCheckTrue(uniqueLandmark);
        });
    });

    function expectCheckTrue(node): void {
        expectCheckValue(node, true);
    }

    function expectCheckFalse(node): void {
        expectCheckValue(node, false);
    }

    function expectCheckValue(node, value: boolean): void {
        expect(uniqueLandmarkConfiguration.checks[0].evaluate.call(checkContext, node)).toBe(value);
    }

    function createTestFixture(id: string, content: string): HTMLDivElement {
        const testFixture: HTMLDivElement = document.createElement('div');
        testFixture.setAttribute('id', id);
        document.body.appendChild(testFixture);
        testFixture.innerHTML = content;
        return testFixture;
    }
});
