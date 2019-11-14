// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Mock, Times } from 'typemoq';

import { HTMLElementUtils } from '../../../../common/html-element-utils';
import { TabbableElementsHelper } from '../../../../common/tabbable-elements-helper';
import { TestDocumentCreator } from '../../common/test-document-creator';

describe('TabbableElementsHelperTest', () => {
    test('getCurrentTabbedElement', () => {
        const dom = TestDocumentCreator.createTestDocument(`
                <div id="id1"></div>
                <div id="id2"></div>
                <div id="id3"></div>
                <div id="id4"></div>
                <div id="id5"></div>
            `);

        const focusedDiv: HTMLElement = dom.querySelector(
            '#id3',
        ) as HTMLElement;

        const htmlElementUtilsMock = Mock.ofType(HTMLElementUtils);
        htmlElementUtilsMock
            .setup(h => h.getCurrentFocusedElement())
            .returns(() => focusedDiv)
            .verifiable(Times.once());

        const testObject = new TabbableElementsHelper(
            htmlElementUtilsMock.object,
        );
        expect(testObject.getCurrentFocusedElement()).toEqual(focusedDiv);
        htmlElementUtilsMock.verifyAll();
    });
});
