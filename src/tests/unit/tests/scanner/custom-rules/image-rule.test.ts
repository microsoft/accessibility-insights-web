// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { withAxeSetup } from 'scanner/axe-utils';
import { imageConfiguration } from 'scanner/custom-rules/image-rule';
import { GlobalMock, GlobalScope, IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('imageRule', () => {
    describe('verify image rule configs', () => {
        it('should have correct props', () => {
            expect(imageConfiguration.rule.id).toBe('image-function');
            expect(imageConfiguration.rule.selector).toBe('*');
            expect(imageConfiguration.rule.any[0]).toBe('image-function-data-collector');
            expect(imageConfiguration.rule.all).toEqual([]);
            expect(imageConfiguration.rule.all.length).toBe(0);
            expect(imageConfiguration.rule.any.length).toBe(1);
            expect(imageConfiguration.checks[0].id).toBe('image-function-data-collector');
        });
    });

    describe('verify matches', () => {
        let fixture: HTMLElement;

        beforeEach(() => {
            fixture = document.createElement('div');
            fixture.setAttribute('id', 'test-fixture');
            document.body.appendChild(fixture);
        });

        afterEach(() => {
            document.body.querySelector('#test-fixture').remove();
        });

        it('should match img elements', () => {
            const node = document.createElement('img');
            expect(imageConfiguration.rule.matches(node, null)).toBeTruthy();
        });

        it('should match role=img elements', () => {
            const node = document.createElement('div');
            node.setAttribute('role', 'img');

            expect(imageConfiguration.rule.matches(node, null)).toBeTruthy();
        });

        it('should match svg elements', () => {
            const node = document.createElement('svg');
            expect(imageConfiguration.rule.matches(node, null)).toBeTruthy();
        });

        it('should match empty <i> elements', () => {
            const node = document.createElement('i');
            expect(imageConfiguration.rule.matches(node, null)).toBeTruthy();
        });

        it('should match css background image elements for non-empty <i> with background image', () => {
            const node = document.createElement('i');
            node.innerHTML = 'some text';
            node.style.backgroundImage = 'image';

            expect(imageConfiguration.rule.matches(node, null)).toBeTruthy();
        });

        it('should not match', () => {
            const windowMock = GlobalMock.ofInstance(
                window.getComputedStyle,
                'getComputedStyle',
                window,
                MockBehavior.Strict,
            );
            windowMock
                .setup(m => m(It.isAny()))
                .returns(() => ({ getPropertyValue: property => 'none' } as CSSStyleDeclaration));
            let result;
            const node = document.createElement('div');
            GlobalScope.using(windowMock).with(() => {
                result = imageConfiguration.rule.matches(node, null);
            });
            expect(result).toBeFalsy();
        });
    });

    describe('verify evaluate', () => {
        let dataSetterMock: IMock<(data) => void>;
        let fixture: HTMLElement;

        beforeEach(() => {
            dataSetterMock = Mock.ofInstance(data => {});
            fixture = createTestFixture('test-fixture', '');
        });

        afterEach(() => {
            document.body.querySelector('#test-fixture').remove();
        });

        it('should always return true', () => {
            fixture.innerHTML = `
                <div id="el1" alt="hello"></div>
            `;
            const element1 = fixture.querySelector('#el1');

            dataSetterMock.setup(d => d(It.isAny()));
            const result = getResultForCheck({ data: dataSetterMock.object }, element1);
            expect(result).toBeTruthy();
        });

        it('should set accessibleName properly, coded as meaningful because no alt and with accessible name', () => {
            fixture.innerHTML = `
                <img id="el1" aria-labelledby="el3" />
                <div id="el3"> hello </div>
            `;
            const element1 = fixture.querySelector('#el1');

            const expectedData = {
                imageType: '<img>',
                accessibleName: 'hello',
                codedAs: 'Meaningful',
                role: null,
            };
            dataSetterMock.setup(d => d(It.isValue(expectedData))).verifiable(Times.once());

            const result = getResultForCheck({ data: dataSetterMock.object }, element1);
            expect(result).toBeTruthy();
            dataSetterMock.verifyAll();
        });

        it('should consider image is Decorative if it has role=none', () => {
            fixture.innerHTML = `
                <img id="el1"  role="none"/>
            `;
            const node = fixture.querySelector('#el1');

            const expectedData = {
                imageType: '<img>',
                accessibleName: '',
                codedAs: 'Decorative',
                role: 'none',
            };
            dataSetterMock.setup(d => d(It.isValue(expectedData))).verifiable(Times.once());

            const result = getResultForCheck({ data: dataSetterMock.object }, node);
            expect(result).toBeTruthy();
            dataSetterMock.verifyAll();
        });

        it('should consider image is Decorative if it has role=presentation', () => {
            fixture.innerHTML = `
                <img id="el1"  role="presentation"/>
            `;
            const node = fixture.querySelector('#el1');

            const expectedData = {
                imageType: '<img>',
                accessibleName: '',
                codedAs: 'Decorative',
                role: 'presentation',
            };
            dataSetterMock.setup(d => d(It.isValue(expectedData))).verifiable(Times.once());

            const result = getResultForCheck({ data: dataSetterMock.object }, node);
            expect(result).toBeTruthy();
            dataSetterMock.verifyAll();
        });

        it('should consider image is Decorative if it has alt=""', () => {
            fixture.innerHTML = `
                <img id="el1"  alt=""/>
            `;
            const node = fixture.querySelector('#el1');

            const expectedData = {
                imageType: '<img>',
                accessibleName: '',
                codedAs: 'Decorative',
                role: null,
            };
            dataSetterMock.setup(d => d(It.isValue(expectedData))).verifiable(Times.once());

            const result = getResultForCheck({ data: dataSetterMock.object }, node);
            expect(result).toBeTruthy();
            dataSetterMock.verifyAll();
        });

        it('cannot tell if image is Decorative or Meaningful if it has no alt, no accessible name', () => {
            fixture.innerHTML = `
                <img id="el1"/>
            `;
            const node = fixture.querySelector('#el1');

            const expectedData = {
                imageType: '<img>',
                accessibleName: '',
                codedAs: null,
                role: null,
            };
            dataSetterMock.setup(d => d(It.isValue(expectedData))).verifiable(Times.once());

            const result = getResultForCheck({ data: dataSetterMock.object }, node);
            expect(result).toBeTruthy();
            dataSetterMock.verifyAll();
        });

        it('should set imageType to Role=img for elements with img role', () => {
            const node = document.createElement('div');
            node.setAttribute('role', 'img');
            const expectedData = {
                imageType: 'Role="img"',
                accessibleName: '',
                codedAs: null,
                role: 'img',
            };
            dataSetterMock.setup(d => d(It.isValue(expectedData))).verifiable(Times.once());
            fixture.appendChild(node);

            const result = getResultForCheck({ data: dataSetterMock.object }, node);
            expect(result).toBeTruthy();
            dataSetterMock.verifyAll();
        });

        it('should set imageType to icon fonts (empty <i> elements) for empty <i>', () => {
            const node = document.createElement('i');
            const expectedData = {
                imageType: 'icon fonts (empty <i> elements)',
                accessibleName: '',
                codedAs: 'Decorative',
                role: null,
            };
            dataSetterMock.setup(d => d(It.isValue(expectedData))).verifiable(Times.once());
            fixture.appendChild(node);

            const result = getResultForCheck({ data: dataSetterMock.object }, node);
            expect(result).toBeTruthy();
            dataSetterMock.verifyAll();
        });

        it('should set imageType to CSS background-image for elements with img background', () => {
            const node = document.createElement('div');
            node.style.backgroundImage = 'imageUrl';
            const expectedData = {
                imageType: 'CSS background-image',
                accessibleName: '',
                codedAs: 'Decorative',
                role: null,
            };
            dataSetterMock.setup(d => d(It.isValue(expectedData))).verifiable(Times.once());
            fixture.appendChild(node);

            const result = getResultForCheck({ data: dataSetterMock.object }, node);
            expect(result).toBeTruthy();
            dataSetterMock.verifyAll();
        });

        it('imageType should be unknown for nodes that is not image', () => {
            const node = document.createElement('div');
            fixture.appendChild(node);

            dataSetterMock.setup(d =>
                d(
                    It.is(propertyBag => {
                        return propertyBag.imageType == null;
                    }),
                ),
            );

            const result = getResultForCheck({ data: dataSetterMock.object }, node);
            expect(result).toBeTruthy();
        });

        function getResultForCheck(data, node: Element): boolean {
            return withAxeSetup(() => imageConfiguration.checks[0].evaluate.call(data, node));
        }
    });

    function createTestFixture(id: string, content: string): HTMLDivElement {
        const testFixture: HTMLDivElement = document.createElement('div');
        testFixture.setAttribute('id', id);
        document.body.appendChild(testFixture);
        testFixture.innerHTML = content;
        return testFixture;
    }
});
