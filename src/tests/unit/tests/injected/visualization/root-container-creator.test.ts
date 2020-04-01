// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Mock } from 'typemoq';
import { IMock } from 'typemoq';
import { HTMLElementUtils } from '../../../../../common/html-element-utils';

import { RootContainerCreator } from '../../../../../injected/visualization/root-container-creator';

describe(RootContainerCreator, () => {
    let htmlElementUtilsMock: IMock<HTMLElementUtils>;
    let bodyStub: HTMLElement;

    beforeEach(() => {
        htmlElementUtilsMock = Mock.ofType(HTMLElementUtils);

        bodyStub = document.createElement('body');
        htmlElementUtilsMock.setup(h => h.getBody()).returns(() => bodyStub);
    });

    it('should create root container', () => {
        const id = 'test-id';
        const selector = `#${id}`;

        htmlElementUtilsMock.setup(h => h.deleteAllElements(selector)).verifiable();

        new RootContainerCreator(htmlElementUtilsMock.object).create(id);

        htmlElementUtilsMock.verifyAll();
        expect(bodyStub.childNodes.length).toBe(1);

        const childElement = bodyStub.querySelector(selector);
        expect(childElement).toBeDefined();
        expect(childElement.tagName).toBe('DIV');
    });
});
