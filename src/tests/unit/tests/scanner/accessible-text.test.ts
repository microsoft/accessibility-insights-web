// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Axe from 'axe-core';
import { withAxeSetup } from 'scanner/axe-utils';

describe('axe.commons.text.accessibleText examples', () => {
    let fixture;

    beforeEach(() => {
        fixture = createTestFixture('test-fixture', '');
    });

    it('should find accessible text by following aria-labelledby', () => {
        fixture.innerHTML = `
            <element1 id="el1" aria-labelledby="el3" />
            <element2 id="el2" aria-labelledby="el1" />
            <element3 id="el3"> hello </element3>
        `;

        const element1 = fixture.querySelector('#el1');

        const accessibleText = withAxeSetup(() => Axe.commons.text.accessibleText(element1, false));
        expect(accessibleText).toBe('hello');
    });

    it('should find accessible text by following aria-labelledby (2 levels deep)', () => {
        fixture.innerHTML = `
            <element1 id="el1" aria-labelledby="el3" />
            <element2 id="el2" aria-labelledby="el1" />
            <element3 id="el3"> hello </element3>
        `;

        const element2 = fixture.querySelector('#el2');

        const accessibleText = withAxeSetup(() => Axe.commons.text.accessibleText(element2, false));
        expect(accessibleText).toBe('hello');
    });

    it('should find accessible text by combining aria label and aria labelledby', () => {
        fixture.innerHTML = `
            <a id="file_row2" href="./files/HolidayLetter.pdf">HolidayLetter.pdf</a>
            <span role="button" tabindex="0" id="del_row2" aria-label="Delete" aria-labelledby="del_row2 file_row2"></span>
            `;

        const span = fixture.querySelector('#del_row2');

        const accessibleText = withAxeSetup(() => Axe.commons.text.accessibleText(span, false));
        expect(accessibleText).toBe('Delete HolidayLetter.pdf');
    });

    function createTestFixture(id: string, content: string): HTMLDivElement {
        const testFixture: HTMLDivElement = document.createElement('div');
        testFixture.setAttribute('id', id);
        document.body.appendChild(testFixture);
        testFixture.innerHTML = content;
        return testFixture;
    }
});
