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
            name: 'AccessibleName',
        };

        document.body.innerHTML = `<div id="element"/>AccessibleName`;
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
});
