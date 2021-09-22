// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GlobalMock, GlobalScope, IGlobalMock, It, Mock, MockBehavior, Times } from 'typemoq';

import * as AxeUtils from '../../../../../scanner/axe-utils';
import { linkFunctionConfiguration } from '../../../../../scanner/custom-rules/link-function';

const outerHTML = 'outerHTML';
const parentOuterHTML = 'parentOuterHTML';

describe('link function', () => {
    describe('verify link function configs', () => {
        it('should have correct props', () => {
            expect(linkFunctionConfiguration.rule.id).toBe('link-function');
            expect(linkFunctionConfiguration.rule.selector).toBe('a');
            expect(linkFunctionConfiguration.rule.any[0]).toBe('link-function');
            expect(linkFunctionConfiguration.rule.none[0]).toBe('has-widget-role');
            expect(linkFunctionConfiguration.rule.all[0]).toBe('valid-role-if-present');
            expect(linkFunctionConfiguration.rule.any.length).toBe(1);
            expect(linkFunctionConfiguration.rule.none.length).toBe(1);
            expect(linkFunctionConfiguration.rule.all.length).toBe(1);
            expect(linkFunctionConfiguration.checks[0].id).toBe('link-function');
            expect(linkFunctionConfiguration.checks[1].id).toBe('valid-role-if-present');
        });
    });

    describe('matches', () => {
        it('matches elements with no href attribute', () => {
            testMatches(null, false, true);
        });
        it('matches elements with an empty href attribute', () => {
            testMatches('', false, true);
        });
        it('matches elements with an empty anchor tag as their href value', () => {
            testMatches('#', false, true);
        });
        it('matches elements that axe-core considers to have custom widget markup', () => {
            testMatches('valid-href-value', true, true);
        });
        it("does not match elements with meaningful href values that axe-core doesn't flag", () => {
            testMatches('valid-href-value', false, false);
        });
    });

    describe('verify decorateNode', () => {
        it('decorates properly if any/snippet are defined', () => {
            const snippetValue = 'test snippet';
            const nodeStub = {
                snippet: null,
                any: [{ data: { snippet: snippetValue } }],
            };
            linkFunctionConfiguration.rule.decorateNode(nodeStub as any);
            expect(nodeStub.snippet).toEqual(snippetValue);
        });

        it('decorate has no function if no any check exists', () => {
            const nodeStub = {
                snippet: null,
                any: [],
            };
            linkFunctionConfiguration.rule.decorateNode(nodeStub as any);
            expect(nodeStub.snippet).toBeNull();
        });
    });

    describe('verify evaluate', () => {
        const getPropertyValuesMock = GlobalMock.ofInstance(
            AxeUtils.getPropertyValuesMatching,
            'getPropertyValuesMatching',
            AxeUtils,
            MockBehavior.Strict,
        );
        const getAccessibleTextMock = GlobalMock.ofInstance(
            AxeUtils.getAccessibleText,
            'getAccessibleText',
            AxeUtils,
            MockBehavior.Strict,
        );
        it('evaluates when both accessible-name and url are specified (node html as snippet)', () => {
            testEvaluate(
                'accessible-name',
                'url',
                true,
                getPropertyValuesMock,
                getAccessibleTextMock,
                'self',
            );
        });
        it('evaluates when url is unspecified (parent html as snippet)', () => {
            testEvaluate(
                'accessible-name',
                null,
                true,
                getPropertyValuesMock,
                getAccessibleTextMock,
                'parent',
            );
        });
        it('evaluates when accessible-name is unspecified (parent html as snippet)', () => {
            testEvaluate(null, 'url', true, getPropertyValuesMock, getAccessibleTextMock, 'parent');
        });
        it('evaluates when accessible-name is unspecified and no parent exists (node html as snippet)', () => {
            testEvaluate(null, 'url', false, getPropertyValuesMock, getAccessibleTextMock, 'self');
        });
    });
});

function testEvaluate(
    accessibleName: string,
    url: string,
    nodeHasParent: boolean,
    getPropertyValuesMock: IGlobalMock<any>,
    getAccessibleTextMock: IGlobalMock<any>,
    expectedSnippet: 'parent' | 'self',
): void {
    const dataSetterMock = Mock.ofInstance(data => {});

    const expectedData = {
        accessibleName: accessibleName,
        ariaAttributes: {
            'aria-property': 'value',
        },
        role: 'role',
        tabIndex: 'tabindex',
        url: url,
        snippet: expectedSnippet === 'self' ? outerHTML : parentOuterHTML,
    };
    const nodeStub = getNodeStub(
        expectedData.url,
        expectedData.role,
        expectedData.tabIndex,
        nodeHasParent,
    );

    dataSetterMock.setup(m => m(It.isValue(expectedData))).verifiable(Times.once());
    getPropertyValuesMock
        .setup(m => m(It.isValue(nodeStub), It.isAny()))
        .returns(v => expectedData.ariaAttributes);
    getAccessibleTextMock.setup(m => m(nodeStub)).returns(n => expectedData.accessibleName);

    let result;
    GlobalScope.using(getPropertyValuesMock, getAccessibleTextMock).with(() => {
        result = linkFunctionConfiguration.checks[0].evaluate.call(
            { data: dataSetterMock.object },
            nodeStub,
        );
    });
    expect(result).toBe(true);
    dataSetterMock.verifyAll();
}

function testMatches(
    href: string,
    expectedHasCustomWidgetMarkup: boolean,
    expectedResult: boolean,
): void {
    const nodeStub = getNodeStub(href, null, null, true);
    const hasCustomWidgetMarkupMock = GlobalMock.ofInstance(
        AxeUtils.hasCustomWidgetMarkup,
        'hasCustomWidgetMarkup',
        AxeUtils,
        MockBehavior.Strict,
    );
    hasCustomWidgetMarkupMock
        .setup(m => m(It.isValue(nodeStub)))
        .returns(v => expectedHasCustomWidgetMarkup);
    let result;
    GlobalScope.using(hasCustomWidgetMarkupMock).with(() => {
        result = linkFunctionConfiguration.rule.matches(nodeStub, null);
    });
    expect(result).toBe(expectedResult);
}

function getNodeStub(
    href: string,
    role: string,
    tabindex: string,
    withParent: boolean,
): HTMLElement {
    return {
        outerHTML: outerHTML,
        parentElement: withParent
            ? {
                  outerHTML: parentOuterHTML,
              }
            : null,
        getAttribute: attr => {
            if (attr === 'href') {
                return href;
            } else if (attr === 'role') {
                return role;
            } else if (attr === 'tabindex') {
                return tabindex;
            }
        },
    } as HTMLElement;
}
