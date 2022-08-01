// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { withAxeSetup } from 'scanner/axe-utils';
import { linkFunctionConfiguration } from 'scanner/custom-rules/link-function';
import { It, Mock, Times } from 'typemoq';

describe('link function', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

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
        it('matches <a> elements with no href attribute', () => {
            testMatches('a', null, null, true);
        });
        it('matches <a> elements with an empty href attribute', () => {
            testMatches('a', '', null, true);
        });
        it('matches <a> elements with an empty anchor tag as their href value', () => {
            testMatches('a', '#', null, true);
        });
        it('matches <div> elements with custom widget markup', () => {
            testMatches('div', 'valid-href-value', 'link', true);
        });
        it('does not match <div> elements no custom widget markup, even with href', () => {
            testMatches('div', 'valid-href-value', null, false);
        });

        function testMatches(
            tag: string,
            href: string | null,
            role: string | null,
            expectedResult: boolean,
        ): void {
            const nodeStub = createStubElement(tag);
            if (href != null) {
                nodeStub.setAttribute('href', href);
            }
            if (role != null) {
                nodeStub.setAttribute('role', role);
            }

            const result = withAxeSetup(() =>
                linkFunctionConfiguration.rule.matches(nodeStub, null),
            );
            expect(result).toBe(expectedResult);
        }
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
        it('evaluates when both accessible-name and url are specified (node html as snippet)', () => {
            testEvaluate('accessible-name', 'url', 'self');
        });
        it('evaluates when url is unspecified (parent html as snippet)', () => {
            testEvaluate('accessible-name', null, 'parent');
        });
        it('evaluates when accessible-name is unspecified (parent html as snippet)', () => {
            testEvaluate(null, 'url', 'parent');
        });

        function testEvaluate(
            accessibleName: string | null,
            url: string | null,
            expectedSnippet: 'parent' | 'self',
        ): void {
            const dataSetterMock = Mock.ofInstance(data => {});

            const expectedData = {
                accessibleName: '',
                ariaAttributes: {
                    'aria-property': 'aria-property-value',
                },
                role: 'role',
                tabIndex: 'tabindex',
                url: url,
            };

            const nodeStub = createStubElement('div');
            if (url != null) {
                nodeStub.setAttribute('href', url);
            }
            nodeStub.setAttribute('role', expectedData.role);
            nodeStub.setAttribute('tabindex', expectedData.tabIndex);
            nodeStub.setAttribute('aria-property', 'aria-property-value');

            if (accessibleName != null) {
                nodeStub.setAttribute('aria-label', accessibleName);

                expectedData.accessibleName = accessibleName;
                expectedData.ariaAttributes['aria-label'] = accessibleName;
            }

            dataSetterMock
                .setup(m => m(It.isObjectWith(expectedData)))
                .callback(data => {
                    expect(data.snippet).toBe(
                        expectedSnippet === 'self'
                            ? nodeStub.outerHTML
                            : nodeStub.parentElement.outerHTML,
                    );
                })
                .verifiable(Times.once());

            const result = withAxeSetup(() =>
                linkFunctionConfiguration.checks[0].evaluate.call(
                    { data: dataSetterMock.object },
                    nodeStub,
                ),
            );
            expect(result).toBe(true);
            dataSetterMock.verifyAll();
        }
    });

    function createStubElement(tag: string): HTMLElement {
        const stub = document.createElement(tag);
        document.body.appendChild(stub);
        return stub;
    }
});
