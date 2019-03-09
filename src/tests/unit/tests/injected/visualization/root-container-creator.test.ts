import { Mock } from 'typemoq';
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RootContainerCreator } from '../../../../../injected/visualization/root-container-creator';
import { HTMLElementUtils } from '../../../../../common/html-element-utils';
import { IMock } from 'typemoq';

describe(RootContainerCreator, () => {
    let htmlElementUtilsMock: IMock<HTMLElementUtils>;
    let bodyStub: HTMLElement;

    beforeEach(() => {
        htmlElementUtilsMock = Mock.ofType(HTMLElementUtils);

        bodyStub = document.createElement('body');
        htmlElementUtilsMock.setup(h => h.querySelector('body')).returns(() => bodyStub);
    });

    it('should create root container', () => {
        htmlElementUtilsMock.setup(h => h.deleteAllElements('#accessibility-insights-root-container')).verifiable();

        new RootContainerCreator(htmlElementUtilsMock.object).create();

        htmlElementUtilsMock.verifyAll();
        expect(bodyStub.childNodes.length).toBe(1);

        const childElement = bodyStub.querySelector('#accessibility-insights-root-container');
        expect(childElement).toBeDefined();
        expect(childElement.tagName).toBe('DIV');
    });
});
