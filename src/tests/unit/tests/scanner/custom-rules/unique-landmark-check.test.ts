// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock } from 'typemoq';

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
    const axeLabelFunctionBackup: (node: Element) => string = axe.commons.aria.label;
    const labelFunctionMock: IMock<(node: Element) => string> = Mock.ofInstance((node: Element) => {
        return '';
    });

    beforeEach(() => {
        check = axe._audit.defaultConfig.checks.find(elem => {
            return elem.id === 'unique-landmark';
        });

        fixture = createTestFixture('test-fixture', '');
        checkContext._data = null;
        axe.commons.aria.label = labelFunctionMock.object;
    });

    afterEach(() => {
        axe.commons.aria.label = axeLabelFunctionBackup;
        labelFunctionMock.reset();
        fixture.remove();
    });

    it('check exist', () => {
        expect(check).not.toBeNull();
    });

    it('set role & label for landmark', () => {
        fixture.innerHTML = `
            <div role="banner" id="landmark1" aria-label="header landmark"></div>
            `;

        const node = fixture.querySelector('#landmark1');

        labelFunctionMock.setup(lfm => lfm(node)).returns(() => 'header landmark');

        expectCheckTrue(node);
        expect(checkContext._data).toEqual({
            role: 'banner',
            label: 'header landmark',
        });
    });

    it('set role & label for html5 element', () => {
        fixture.innerHTML = `
            <div id="sectionLabel">section landmark</sectionLabel>
            <section id="landmark1" aria-labelledby="sectionLabel"></section>
            `;

        const node = fixture.querySelector('#landmark1');
        labelFunctionMock.setup(lfm => lfm(node)).returns(() => 'section landmark');

        expectCheckTrue(node);
        expect(checkContext._data).toEqual({
            role: 'region',
            label: 'section landmark',
        });
    });

    it('should exclude hidden landmarks for unique check', () => {
        fixture.innerHTML = `
            <div role="banner" id="landmark1" style="display:none">landmark1</div>
            <div role="banner" id="landmark2">landmark2</div>
            `;

        const node = fixture.querySelector('#landmark2');
        const expectedNode: Element = fixture.querySelector('#landmark1');

        labelFunctionMock.setup(lfm => lfm(node)).returns(() => null);
        labelFunctionMock
            .setup(lfm => lfm(It.isObjectWith(expectedNode)))
            .returns(() => 'header landmark');

        expectCheckTrue(node);
    });

    describe('duplicate label validation', () => {
        let duplicateLandmark1: Element;
        let duplicateLandmark2: Element;
        let uniqueLandmark: Element;
        const duplicateLandmarkLabel = 'duplicate landmark';

        beforeEach(() => {
            fixture.innerHTML = `
            <div role="banner" id="landmark1">landmark1</div>
            <div role="banner" id="landmark2">landmark2</div>
            <div role="banner" id="landmark3">landmark3</div>
            `;

            duplicateLandmark1 = fixture.querySelector('#landmark1');
            duplicateLandmark2 = fixture.querySelector('#landmark2');
            uniqueLandmark = fixture.querySelector('#landmark3');

            labelFunctionMock
                .setup(lfm => lfm(duplicateLandmark1))
                .returns(() => duplicateLandmarkLabel);
            labelFunctionMock
                .setup(lfm => lfm(duplicateLandmark2))
                .returns(() => duplicateLandmarkLabel);
            labelFunctionMock
                .setup(lfm => lfm(uniqueLandmark))
                .returns(() => 'some other landmark');
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
