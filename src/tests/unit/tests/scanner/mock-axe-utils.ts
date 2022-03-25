// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import axe from 'axe-core';
import { cloneDeep } from 'lodash';
import { GlobalMock, GlobalScope, IGlobalMock, Times } from 'typemoq';

export function withAxeCommonsMocked(
    property: string,
    overrideMocks: {
        [key: string]: any;
    },
    testFunction: () => void,
    otherMocks: IGlobalMock<any>[] = [],
): void {
    const origAxeProperties = cloneDeep(axe.commons[property]);
    const commonsMock = GlobalMock.ofInstance(axe.commons, 'commons', axe);
    GlobalScope.using(commonsMock, ...otherMocks).with(() => {
        const testStub = {
            ...origAxeProperties,
            ...overrideMocks,
        };

        commonsMock
            .setup(m => m[property])
            .returns(() => testStub)
            .verifiable(Times.atLeastOnce());

        testFunction();
        commonsMock.verifyAll();
    });
}
