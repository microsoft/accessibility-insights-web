// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { TabbableElementsHelper } from '../../../common/tabbable-elements-helper';
import { TestDocumentCreator } from '../../Common/test-document-creator';
import { HTMLElementUtils } from './../../../common/html-element-utils';

function chooseExpectedElements(dom: NodeSelector, tag: string, ids: number[]) {
    const elements = dom.querySelectorAll(tag);
    return ids.map(i => elements[i]);
}

describe('TabbableElementsHelperTest', () => {
    const tabbableElements = [
        'input',
        'select',
        'textarea',
        'button',
        'a[href]',
        'a[tabindex]',
        'object',
        '[tabindex]',
        'area[href]',
    ];
    const tabbableSelector = tabbableElements.join(', ');

    test('getAllTabbableElements: input', () => {
        const dom = TestDocumentCreator.createTestDocument(`
                <input tabindex='1' id = 'test' style='display: block; height:2px; width:1px'></input>
                <input tabindex='-1'></input>
                <input disabled='true'></input>
                <input style='visibility: hidden'></input>
                <input style='display: none'></input>
                <input style='display: block; height:2px; width:1px'></input>
            `);

        document.body.appendChild(dom);

        const allElements = dom.querySelectorAll(tabbableSelector);

        const htmlUtilsMocks = new HTMLElementUtilsMockBuilder()
            .setupQuerySelectorAll(tabbableSelector, allElements)
            .setupElementMatches(allElements[0], tabbableSelector)
            .setupElementMatches(allElements[5], tabbableSelector)
            .build();

        const testObject = new TabbableElementsHelper(htmlUtilsMocks.object);
        const allTabbableElements = testObject.getAllTabbableElements();

        const actual = allTabbableElements.map(e => e.element);
        const expected = chooseExpectedElements(dom, 'input', [0, 5]);

        htmlUtilsMocks.verifyAll();
        expect(actual).toEqual(expected);
        document.body.removeChild(dom);
    });

    test('getAllTabbableElements: select', () => {
        const dom = TestDocumentCreator.createTestDocument(`
                <select tabindex='1' style='height:2px; width:1px' display></select>
                <select tabindex='-1'></select>
                <select disabled="true"></select>
                <select style="visibility: hidden"></select>
                <select style="display: none"></select>
                <select style='height:2px; width:1px'></select>
            `);

        document.body.appendChild(dom);

        const allElements = dom.querySelectorAll(tabbableSelector);

        const htmlUtilsMocks = new HTMLElementUtilsMockBuilder()
            .setupQuerySelectorAll(tabbableSelector, allElements)
            .setupElementMatches(allElements[0], tabbableSelector)
            .setupElementMatches(allElements[5], tabbableSelector)
            .build();

        const testObject = new TabbableElementsHelper(htmlUtilsMocks.object);
        const allTabbableElements = testObject.getAllTabbableElements();

        const actual = allTabbableElements.map(e => e.element);
        const expected = chooseExpectedElements(dom, 'select', [0, 5]);
        expect(actual).toEqual(expected);

        htmlUtilsMocks.verifyAll();
        document.body.removeChild(dom);
    });

    test('getAllTabbableElements: textarea', () => {
        const dom = TestDocumentCreator.createTestDocument(`
                <textarea tabindex='1' style='height:2px; width:1px'></textarea>
                <textarea tabindex='-1'></textarea>
                <textarea disabled="true"></textarea>
                <textarea style="visibility: hidden"></textarea>
                <textarea style="display: none"></textarea>
                <textarea style='height:2px; width:1px'></textarea>
            `);

        document.body.appendChild(dom);

        const allElements = dom.querySelectorAll(tabbableSelector);

        const htmlUtilsMocks = new HTMLElementUtilsMockBuilder()
            .setupQuerySelectorAll(tabbableSelector, allElements)
            .setupElementMatches(allElements[0], tabbableSelector)
            .setupElementMatches(allElements[5], tabbableSelector)
            .build();

        const testObject = new TabbableElementsHelper(htmlUtilsMocks.object);
        const allTabbableElements = testObject.getAllTabbableElements();

        const actual = allTabbableElements.map(e => e.element);
        const expected = chooseExpectedElements(dom, 'textarea', [0, 5]);
        expect(actual).toEqual(expected);

        htmlUtilsMocks.verifyAll();
        document.body.removeChild(dom);
    });

    test('getAllTabbableElements: button', () => {
        const dom = TestDocumentCreator.createTestDocument(`
                <button tabindex='1' style='height:2px; width:1px'></button>
                <button tabindex='-1'></button>
                <button disabled="true"></button>
                <button style="visibility: hidden"></button>
                <button style="display: none"></button>
                <button style='height:2px; width:1px'></button>
            `);

        document.body.appendChild(dom);

        const allElements = dom.querySelectorAll(tabbableSelector);

        const htmlUtilsMocks = new HTMLElementUtilsMockBuilder()
            .setupQuerySelectorAll(tabbableSelector, allElements)
            .setupElementMatches(allElements[0], tabbableSelector)
            .setupElementMatches(allElements[5], tabbableSelector)
            .build();

        const testObject = new TabbableElementsHelper(htmlUtilsMocks.object);
        const allTabbableElements = testObject.getAllTabbableElements();

        const actual = allTabbableElements.map(e => e.element);
        const expected = chooseExpectedElements(dom, 'button', [0, 5]);
        expect(actual).toEqual(expected);

        htmlUtilsMocks.verifyAll();
        document.body.removeChild(dom);
    });

    test('getAllTabbableElements: object', () => {
        const dom = TestDocumentCreator.createTestDocument(`
                <object tabindex='1' style='height:2px; width:1px'></object>
                <object tabindex='-1'></object>
                <object style='height:0px; width:0px'></object>
                <object style="visibility: hidden"></object>
                <object style="display: none"></object>
                <object style='height:2px; width:1px'></object>
            `);

        document.body.appendChild(dom);

        const allElements = dom.querySelectorAll(tabbableSelector);

        const htmlUtilsMocks = new HTMLElementUtilsMockBuilder()
            .setupQuerySelectorAll(tabbableSelector, allElements)
            .setupElementMatches(allElements[0], tabbableSelector)
            .setupElementMatches(allElements[5], tabbableSelector)
            .build();

        const testObject = new TabbableElementsHelper(htmlUtilsMocks.object);
        const allTabbableElements = testObject.getAllTabbableElements();

        const actual = allTabbableElements.map(e => e.element);
        const expected = chooseExpectedElements(dom, 'object', [0, 5]);
        expect(actual).toEqual(expected);

        htmlUtilsMocks.verifyAll();
        document.body.removeChild(dom);
    });

    test('getAllTabbableElements: anchor', () => {
        const dom = TestDocumentCreator.createTestDocument(`
                <a href="href" tabindex='1' style='display:block; padding: 1px;'></a>
                <a tabindex='-1'></a>
                <a disabled="true"></a>
                <a style="visibility: hidden"></a>
                <a style="display: none"></a>
                <a></a>
                <a href="href" style='display:block; padding: 1px;'></a>
            `);

        document.body.appendChild(dom);

        const allElements = dom.querySelectorAll(tabbableSelector);

        const htmlUtilsMocks = new HTMLElementUtilsMockBuilder()
            .setupQuerySelectorAll(tabbableSelector, allElements)
            .setupElementMatches(allElements[0], tabbableSelector)
            .setupElementMatches(allElements[2], tabbableSelector)
            .build();

        const testObject = new TabbableElementsHelper(htmlUtilsMocks.object);
        const allTabbableElements = testObject.getAllTabbableElements();

        const actual = allTabbableElements.map(e => e.element);
        const expected = chooseExpectedElements(dom, 'a', [0, 6]);
        expect(actual).toEqual(expected);

        htmlUtilsMocks.verifyAll();
        document.body.removeChild(dom);
    });

    test('getCurrentTabbedElement', () => {
        const dom = TestDocumentCreator.createTestDocument(`
                <div id="id1"></div>
                <div id="id2"></div>
                <div id="id3"></div>
                <div id="id4"></div>
                <div id="id5"></div>
            `);

        const focusedDiv: HTMLElement = dom.querySelector('#id3') as HTMLElement;

        const htmlElementUtilsMock = Mock.ofType(HTMLElementUtils);
        htmlElementUtilsMock
            .setup(h => h.getCurrentFocusedElement())
            .returns(() => focusedDiv)
            .verifiable(Times.once());

        const testObject = new TabbableElementsHelper(htmlElementUtilsMock.object);
        expect(testObject.getCurrentFocusedElement()).toEqual(focusedDiv);
        htmlElementUtilsMock.verifyAll();
    });

    test('getSortedElements: no tabIndex', () => {
        const dom = TestDocumentCreator.createTestDocument(`
                <object style='height:2px; width:1px'></object>
                <button style='height:2px; width:1px'></button>
                <input style='height:2px; width:1px'></input>
                <textarea style='height:2px; width:1px'></textarea>
                <select style='height:2px; width:1px'></select>
            `);

        document.body.appendChild(dom);

        const allElements = dom.querySelectorAll(tabbableSelector);

        const htmlUtilsMocks = new HTMLElementUtilsMockBuilder()
            .setupQuerySelectorAll(tabbableSelector, allElements)
            .setupElementMatchesInBulk(allElements, tabbableSelector)
            .build();

        const testObject = new TabbableElementsHelper(htmlUtilsMocks.object);
        const allTabbableElements = testObject.getAllTabbableElements();

        testObject.sortTabbableElements(allTabbableElements);

        expect(allTabbableElements[0].element).toEqual(dom.querySelector('object'));
        expect(allTabbableElements[1].element).toEqual(dom.querySelector('button'));
        expect(allTabbableElements[2].element).toEqual(dom.querySelector('input'));
        expect(allTabbableElements[3].element).toEqual(dom.querySelector('textarea'));
        expect(allTabbableElements[4].element).toEqual(dom.querySelector('select'));

        htmlUtilsMocks.verifyAll();
        document.body.removeChild(dom);
    });

    test('getSortedElements: some have tabIndex', () => {
        const dom = TestDocumentCreator.createTestDocument(`
                <object tabindex="2" style='height:2px; width:1px'></object>
                <button style='height:2px; width:1px'></button>
                <input tabindex="100" style='height:2px; width:1px'></input>
                <textarea tabindex="1" style='height:2px; width:1px'></textarea>
                <select style='height:2px; width:1px'></select>
            `);

        document.body.appendChild(dom);

        const allElements = dom.querySelectorAll(tabbableSelector);

        const htmlUtilsMocks = new HTMLElementUtilsMockBuilder()
            .setupQuerySelectorAll(tabbableSelector, allElements)
            .setupElementMatchesInBulk(allElements, tabbableSelector)
            .build();

        const testObject = new TabbableElementsHelper(htmlUtilsMocks.object);

        const allTabbableElements = testObject.getAllTabbableElements();
        testObject.sortTabbableElements(allTabbableElements);

        expect(allTabbableElements[0].element).toEqual(dom.querySelector('textarea'));
        expect(allTabbableElements[1].element).toEqual(dom.querySelector('object'));
        expect(allTabbableElements[2].element).toEqual(dom.querySelector('input'));
        expect(allTabbableElements[3].element).toEqual(dom.querySelector('button'));
        expect(allTabbableElements[4].element).toEqual(dom.querySelector('select'));

        htmlUtilsMocks.verifyAll();
        document.body.removeChild(dom);
    });

    test('isTabbable: area tag without a map', () => {
        const dom = TestDocumentCreator.createTestDocument(`
                <area id="id1" shape="circle" coords="124,58,8" alt="Venus" href="venus.htm">
            `);

        document.body.appendChild(dom);

        const documentUtils = new HTMLElementUtils(dom as Document);

        const testObject = new TabbableElementsHelper(documentUtils);

        const areaElement = dom.querySelector('#id1') as HTMLElement;

        expect(testObject.isTabbable(areaElement)).toBeFalsy();
        document.body.removeChild(dom);
    });

    test('isTabbable: area tag inside a unnamed map', () => {
        const dom = TestDocumentCreator.createTestDocument(`
                <map>
                    <area id="id1" shape="circle" coords="124,58,8" alt="Venus" href="venus.htm">
                </map>
            `);
        document.body.appendChild(dom);
        const documentUtils = new HTMLElementUtils(dom as Document);
        const testObject = new TabbableElementsHelper(documentUtils);
        const areaElement = dom.querySelector('#id1') as HTMLElement;
        expect(testObject.isTabbable(areaElement)).toBeFalsy();
        document.body.removeChild(dom);
    });

    test('isTabbable: area tag inside a unused map', () => {
        const dom = TestDocumentCreator.createTestDocument(`
                <map name="planetmap">
                    <area id="id1" shape="circle" coords="124,58,8" alt="Venus" href="venus.htm">
                </map>
            `);
        document.body.appendChild(dom);
        const documentUtils = new HTMLElementUtils(dom as Document);
        const testObject = new TabbableElementsHelper(documentUtils);
        const areaElement = dom.querySelector('#id1') as HTMLElement;
        expect(testObject.isTabbable(areaElement)).toBeFalsy();
        document.body.removeChild(dom);
    });

    test('isTabbable: area tag inside a used map, but the image is not visible', () => {
        const dom = TestDocumentCreator.createTestDocument(`
                <img src="planets.gif" width="145" height="126" alt="Planets" style="display:none" usemap="#planetmap">
                <map name="planetmap">
                    <area id="id1" shape="circle" coords="124,58,8" alt="Venus" href="venus.htm">
                </map>
            `);
        document.body.appendChild(dom);
        const documentUtils = new HTMLElementUtils(dom as Document);
        const testObject = new TabbableElementsHelper(documentUtils);
        const areaElement = dom.querySelector('#id1') as HTMLElement;
        expect(testObject.isTabbable(areaElement)).toBeFalsy();
        document.body.removeChild(dom);
    });

    test('isTabbable: valid area tag', () => {
        const dom = TestDocumentCreator.createTestDocument(`
                <img src="planets.gif" width="145" height="126" alt="Planets" usemap="#planetmap">
                <map name="planetmap">
                    <area id="id1" shape="circle" coords="124,58,8" alt="Venus" href="venus.htm">
                </map>
            `);
        document.body.appendChild(dom);
        const documentUtils = HTMLElementUtilsMockBuilder.buildMockCallingBaseImplementation(dom as Document);
        const testObject = new TabbableElementsHelper(documentUtils);
        const areaElement = dom.querySelector('#id1') as HTMLElement;
        expect(testObject.isTabbable(areaElement)).toBe(true);
        document.body.removeChild(dom);
    });

    test('isTabbable: area is not the immediate child of map', () => {
        const dom = TestDocumentCreator.createTestDocument(`
                <img src="planets.gif" width="145" height="126" alt="Planets" usemap="#planetmap">
                <map name="planetmap">
                    <div>
                        <area id="id1" shape="circle" coords="124,58,8" alt="Venus" href="venus.htm">
                    </div>
                </map>
            `);
        document.body.appendChild(dom);
        const documentUtils = HTMLElementUtilsMockBuilder.buildMockCallingBaseImplementation(dom as Document);
        const testObject = new TabbableElementsHelper(documentUtils);
        const areaElement = dom.querySelector('#id1') as HTMLElement;
        expect(testObject.isTabbable(areaElement)).toBeTruthy();
        document.body.removeChild(dom);
    });
});

class HTMLElementUtilsMockBuilder {
    private mock = Mock.ofType(HTMLElementUtils);

    public static buildMockCallingBaseImplementation(dom: Document): HTMLElementUtils {
        const mock = Mock.ofType(HTMLElementUtils, MockBehavior.Loose, false, dom);
        mock.callBase = true;
        HTMLElementUtilsMockBuilder.simulateBrowser(mock);
        return mock.object;
    }

    private static simulateBrowser(mock: IMock<HTMLElementUtils>) {
        const getComputedStyle = (e: Element) => {
            const { height, width, visibility, display } = ((e as HTMLElement).style);
            return {
                visibility,
                display,
                height: height || '12px',
                width: width || '20px',
            } as CSSStyleDeclaration;
        };
        const getHeight = (e: Element) => getComputedStyle(e) ? parseInt(getComputedStyle(e).height, 10) : 0;
        const getWidth = (e: Element) => getComputedStyle(e) ? parseInt(getComputedStyle(e).width, 10) : 0;
        const getClientRects = (e: Element) => ((getHeight(e) && getWidth(e)) ? { length: 1 } : { length: 0 }) as ClientRectList;

        mock.setup(m => m.getComputedStyle(It.isAny()))
            .returns(getComputedStyle);
        mock.setup(m => m.getClientRects(It.isAny()))
            .returns(getClientRects);
        mock.setup(m => m.getOffsetHeight(It.isAny()))
            .returns(getHeight);
        mock.setup(m => m.getOffsetWidth(It.isAny()))
            .returns(getWidth);

    }

    public setupQuerySelectorAll(selector: string, elementsToReturn: NodeListOf<Element>, times?: Times): HTMLElementUtilsMockBuilder {
        const _times = times ? times : Times.once();

        this.mock
            .setup(m => m.querySelectorAll(It.isValue(selector)))
            .returns(() => elementsToReturn)
            .verifiable(_times);

        return this;
    }

    public setupElementMatchesInBulk(
        elements: NodeListOf<Element>,
        selector: string, returnValue = true,
        times?: Times,
    ): HTMLElementUtilsMockBuilder {
        _.each(elements, element => this.setupElementMatches(element, selector, returnValue, times));

        return this;
    }

    public setupElementMatches(element: Element, selector: string, returnValue = true, times?: Times): HTMLElementUtilsMockBuilder {
        const _times = times ? times : Times.once();

        this.mock
            .setup(m => m.elementMatches(element, It.isValue(selector)))
            .returns(() => returnValue)
            .verifiable(_times);

        return this;
    }

    public build() {
        HTMLElementUtilsMockBuilder.simulateBrowser(this.mock);
        return this.mock;
    }
}
