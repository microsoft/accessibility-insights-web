// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import axe from 'axe-core';
import { accessibleNamesConfiguration } from 'scanner/custom-rules/display-accessible-names';
import { It, Mock, Times } from 'typemoq';
import { withAxeSetup } from '../../../../../scanner/axe-utils';

describe('axe.check: display-accessible-names', () => {
    const check = axe._audit.checks['display-accessible-names'];
    it('check exists', () => {
        expect(check).not.toBeNull();
    });
});

describe('evaluateAccessibleNames', () => {
    it('sets the correct data and returns true', () => {
        const dataSetterMock = Mock.ofInstance(data => {});
        const expectedData = {
            accessibleName: 'AccessibleName',
        };

        document.body.innerHTML = `<div id="element"/>AccessibleName</div>`;
        const node = document.body.querySelector('#element');
        dataSetterMock.setup(m => m(It.isValue(expectedData))).verifiable(Times.once());

        const checkResultData = withAxeSetup(() =>
            accessibleNamesConfiguration.checks[0].evaluate.call(
                { data: dataSetterMock.object },
                node,
            ),
        );
        expect(checkResultData).toBe(true);
        dataSetterMock.verifyAll();
    });

    it('should not match because element role is none', () => {
        document.body.innerHTML = `<h1 role="none">heading</h1>`;
        const node = document.querySelector(`h1`);
        const result = withAxeSetup(() => accessibleNamesConfiguration.rule.matches(node, null));
        expect(result).toBe(false);
    });

    it('should not match because hidden element accesible name is empty', () => {
        document.body.innerHTML = `<button role="button" aria-hidden=true>Click this</button>`;
        const node = document.querySelector(`button`);
        const result = withAxeSetup(() => accessibleNamesConfiguration.rule.matches(node, null));
        expect(result).toBe(false);
    });

    it('should not match because element does not have role attribute', () => {
        document.body.innerHTML = `<div>Some text</div>`;
        const node = document.querySelector(`div`);
        const result = withAxeSetup(() => accessibleNamesConfiguration.rule.matches(node, null));
        expect(result).toBe(false);
    });

    it('should not match because element does not have role attribute', () => {
        document.body.innerHTML = `<span>Some text</span>`;
        const node = document.querySelector(`span`);
        const result = withAxeSetup(() => accessibleNamesConfiguration.rule.matches(node, null));
        expect(result).toBe(false);
    });

    it('should match because element has accessible name and accurate role', () => {
        document.body.innerHTML = `<div role="button" aria-labelled-by="click">Some text</div>`;
        const node = document.querySelector(`div`);
        const result = withAxeSetup(() => accessibleNamesConfiguration.rule.matches(node, null));
        expect(result).toBe(true);
    });
});
