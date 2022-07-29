// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import axe from 'axe-core';
import { accessibleNamesConfiguration } from 'scanner/custom-rules/display-accessible-names';
import { createNodeStub } from 'tests/unit/tests/scanner/helpers';
import { GlobalMock, GlobalScope, It, Mock, MockBehavior, Times } from 'typemoq';

import * as AxeUtils from '../../../../../scanner/axe-utils';

describe('axe.check: display-accessible-names', () => {
    const check = axe._audit.checks['display-accessible-names'];
    it('check exists', () => {
        expect(check).not.toBeNull();
    });
});

describe('evaluateAccessibleNames', () => {
    it('sets the correct data and returns true', () => {
        const getAccessibleTextMock = GlobalMock.ofInstance(
            AxeUtils.getAccessibleText,
            'getAccessibleText',
            AxeUtils,
            MockBehavior.Strict,
        );
        const dataSetterMock = Mock.ofInstance(data => {});
        const expectedData = {
            name: 'AccessibleName',
        };
        const nodeStub = createNodeStub('button', { role: 'button' });

        dataSetterMock.setup(m => m(It.isValue(expectedData))).verifiable(Times.once());
        getAccessibleTextMock.setup(m => m(nodeStub)).returns(n => expectedData.name);

        let checkResultData;
        GlobalScope.using(getAccessibleTextMock).with(() => {
            checkResultData = accessibleNamesConfiguration.checks[0].evaluate.call(
                { data: dataSetterMock.object },
                nodeStub,
            );
        });
        expect(checkResultData).toBe(true);
        dataSetterMock.verifyAll();
    });
});
