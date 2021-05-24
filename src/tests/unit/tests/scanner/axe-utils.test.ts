// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as AxeUtils from 'scanner/axe-utils';
import { withAxeCommonsMocked } from 'tests/unit/tests/scanner/mock-axe-utils';
import { GlobalMock, GlobalScope, IGlobalMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('AxeUtils', () => {
    describe('getMatchesFromRule', () => {
        it('should find color-contrast rule', () => {
            expect(AxeUtils.getMatchesFromRule('color-contrast')).toBeDefined();
        });

        it('color-contrast matches should be a function', () => {
            expect(AxeUtils.getMatchesFromRule('color-contrast')).toHaveProperty('call');
        });

        it('should fail if rule does not exist', () => {
            expect(() => AxeUtils.getMatchesFromRule('fake-rule')).toThrow();
        });
    });

    describe('getEvaluateFromCheck', () => {
        it('should find color-contrast rule', () => {
            expect(AxeUtils.getEvaluateFromCheck('color-contrast')).toBeDefined();
        });

        it('color-contrast evaluate should be a function', () => {
            expect(AxeUtils.getEvaluateFromCheck('color-contrast')).toHaveProperty('call');
        });

        it('should fail if rule does not exist', () => {
            expect(() => AxeUtils.getEvaluateFromCheck('fake-rule')).toThrow();
        });
    });

    describe('getOptionsFromCheck', () => {
        it('should find color-contrast rule', () => {
            expect(AxeUtils.getOptionsFromCheck('color-contrast')).toBeDefined();
        });

        it('should fail if rule does not exist', () => {
            expect(() => AxeUtils.getOptionsFromCheck('fake-rule')).toThrow();
        });
    });

    describe('getAccessibleText', () => {
        it.each([true, false])(
            'calls axe.commons.text.accessibleText with given node & isLabelledByContext %p',
            isLabelledByContext => {
                const accessibleTextMock = Mock.ofInstance(
                    (node, context) => '',
                    MockBehavior.Strict,
                );
                const elementStub = {} as HTMLElement;
                accessibleTextMock
                    .setup(m => m(It.isValue(elementStub), isLabelledByContext))
                    .verifiable(Times.once());
                withAxeCommonsMocked('text', { accessibleText: accessibleTextMock.object }, () => {
                    AxeUtils.getAccessibleText(elementStub, isLabelledByContext);
                });
                accessibleTextMock.verifyAll();
            },
        );
    });

    describe('getAccessibleDescription', () => {
        let fixture: HTMLElement;

        beforeEach(() => {
            fixture = createTestFixture('test-fixture', '');
        });

        afterEach(() => {
            document.body.querySelector('#test-fixture').remove();
        });

        it('should return empty string if no aria-describedby', () => {
            fixture.innerHTML = `
                <img id="el1" />
            `;
            const element1 = fixture.querySelector('#el1');
            const result = AxeUtils.withAxeSetup(() =>
                AxeUtils.getAccessibleDescription(element1 as HTMLElement),
            );

            expect(result).toEqual('');
        });

        it('should return accessible description', () => {
            fixture.innerHTML = `
                <img id="el1" aria-describedby="el3" alt="accessibleName"/>
                <img id="el2" aria-labelledby="el3" />
                <div id="el3"> hello </div>
            `;
            const element1 = fixture.querySelector('#el1');
            const result = AxeUtils.withAxeSetup(() =>
                AxeUtils.getAccessibleDescription(element1 as HTMLElement),
            );

            expect(result).toEqual('hello');
        });

        it('multiple idrefs', () => {
            fixture.innerHTML = `
                <img id="el1" aria-describedby="el2 el3 el5" alt="accessibleName"/>
                <div id="el2">hello</div>
                <div id="el3">world</div>
            `;
            const element1 = fixture.querySelector('#el1');
            const result = AxeUtils.withAxeSetup(() =>
                AxeUtils.getAccessibleDescription(element1 as HTMLElement),
            );

            expect(result).toEqual('hello world');
        });
    });

    describe('getImageCodedAs', () => {
        let fixture: HTMLElement;

        beforeEach(() => {
            fixture = createTestFixture('test-fixture', '');
        });

        afterEach(() => {
            document.body.querySelector('#test-fixture').remove();
        });

        it('Decorative because empty alt', () => {
            fixture.innerHTML = `
                <img id="el1" alt="" />
            `;
            const element1 = fixture.querySelector('#el1');
            const result = AxeUtils.withAxeSetup(() =>
                AxeUtils.getImageCodedAs(element1 as HTMLElement),
            );

            expect(result).toEqual('Decorative');
        });

        it('Decorative because empty alt, even with aria label', () => {
            fixture.innerHTML = `
                <img id="el1" alt="" aria-label="some"/>
            `;
            const element1 = fixture.querySelector('#el1');
            const result = AxeUtils.withAxeSetup(() =>
                AxeUtils.getImageCodedAs(element1 as HTMLElement),
            );

            expect(result).toEqual('Decorative');
        });

        it('Decorative because alt not value, even with aria label', () => {
            fixture.innerHTML = `
                <img id="el1" alt aria-label="some"/>
            `;
            const element1 = fixture.querySelector('#el1');
            const result = AxeUtils.withAxeSetup(() =>
                AxeUtils.getImageCodedAs(element1 as HTMLElement),
            );

            expect(result).toEqual('Decorative');
        });

        it('Decorative because svg without role=img, despite aria-label', () => {
            fixture.innerHTML = `
                <svg id="el1" aria-label="some"/>
            `;
            const element1 = fixture.querySelector('#el1');
            const result = AxeUtils.withAxeSetup(() =>
                AxeUtils.getImageCodedAs(element1 as HTMLElement),
            );

            expect(result).toEqual('Decorative');
        });

        it('Decorative because icon font without role=img, despite aria-label', () => {
            fixture.innerHTML = `
                <i id="el1" aria-label="some"/>
            `;
            const element1 = fixture.querySelector('#el1');
            const result = AxeUtils.withAxeSetup(() =>
                AxeUtils.getImageCodedAs(element1 as HTMLElement),
            );

            expect(result).toEqual('Decorative');
        });

        it('decorative because CSS bg image without role=img, despite aria-label', () => {
            fixture.innerHTML = `
                <div id="el1" aria-label="some"/>
            `;
            const element1 = fixture.querySelector('#el1');
            const result = AxeUtils.withAxeSetup(() =>
                AxeUtils.getImageCodedAs(element1 as HTMLElement),
            );

            expect(result).toEqual('Decorative');
        });

        it('Meaningful because alt has some value', () => {
            fixture.innerHTML = `
                <img id="el1" alt="some value"/>
            `;
            const element1 = fixture.querySelector('#el1');
            const result = AxeUtils.withAxeSetup(() =>
                AxeUtils.getImageCodedAs(element1 as HTMLElement),
            );

            expect(result).toEqual('Meaningful');
        });

        it('Meaningful because aria-label', () => {
            fixture.innerHTML = `
                <img id="el1" aria-label="some"/>
            `;
            const element1 = fixture.querySelector('#el1');
            const result = AxeUtils.withAxeSetup(() =>
                AxeUtils.getImageCodedAs(element1 as HTMLElement),
            );

            expect(result).toEqual('Meaningful');
        });

        it('Meaningful because aria-labelledby', () => {
            fixture.innerHTML = `
                <img id="el1" aria-labelledby="some"/>
                <div id="some"> hello </div>
            `;
            const element1 = fixture.querySelector('#el1');
            const result = AxeUtils.withAxeSetup(() =>
                AxeUtils.getImageCodedAs(element1 as HTMLElement),
            );

            expect(result).toEqual('Meaningful');
        });

        it('Meaningful because title', () => {
            fixture.innerHTML = `
                <img id="el1" title="some"/>
            `;
            const element1 = fixture.querySelector('#el1');
            const result = AxeUtils.withAxeSetup(() =>
                AxeUtils.getImageCodedAs(element1 as HTMLElement),
            );

            expect(result).toEqual('Meaningful');
        });

        it('Meaningful because alt="  "', () => {
            fixture.innerHTML = `
                <img id="el1" alt="   "/>
            `;
            const element1 = fixture.querySelector('#el1');
            const result = AxeUtils.withAxeSetup(() =>
                AxeUtils.getImageCodedAs(element1 as HTMLElement),
            );

            expect(result).toEqual('Meaningful');
        });

        it('Meaningful because svg with role=img and accessible text', () => {
            fixture.innerHTML = `
                <svg id="el1" role="img" aria-label="some"/>
            `;
            const element1 = fixture.querySelector('#el1');
            const result = AxeUtils.withAxeSetup(() =>
                AxeUtils.getImageCodedAs(element1 as HTMLElement),
            );

            expect(result).toEqual('Meaningful');
        });

        it('Meaningful because svg with role=img and accessible text', () => {
            fixture.innerHTML = `
                <i id="el1" role="img" title="some"/>
            `;
            const element1 = fixture.querySelector('#el1');
            const result = AxeUtils.withAxeSetup(() =>
                AxeUtils.getImageCodedAs(element1 as HTMLElement),
            );

            expect(result).toEqual('Meaningful');
        });

        it('Meaningful because CSS background image with role=img and accessible text', () => {
            fixture.innerHTML = `
                <div id="el1" role="img" aria-labelledby="el2" />
                <p id="el2">some</p>
            `;
            const element1 = fixture.querySelector('#el1');
            const result = AxeUtils.withAxeSetup(() =>
                AxeUtils.getImageCodedAs(element1 as HTMLElement),
            );

            expect(result).toEqual('Meaningful');
        });

        it('Indeterminate because img with no alt tag', () => {
            fixture.innerHTML = `
                <img id="el1"/>
            `;
            const element1 = fixture.querySelector('#el1');
            const result = AxeUtils.withAxeSetup(() =>
                AxeUtils.getImageCodedAs(element1 as HTMLElement),
            );

            expect(result).toBeNull();
        });

        it('Indeterminate because img with no alt tag, despite aria-describedby', () => {
            fixture.innerHTML = `
                <img id="el1" aria-describedby="some-id"/>
                <div id="some-id"> hello </div>
            `;
            const element1 = fixture.querySelector('#el1');
            const result = AxeUtils.withAxeSetup(() =>
                AxeUtils.getImageCodedAs(element1 as HTMLElement),
            );

            expect(result).toBeNull();
        });
    });

    describe('hasBackgoundImage', () => {
        let fixture: HTMLElement;
        let windowMock: IGlobalMock<typeof window.getComputedStyle>;

        beforeEach(() => {
            fixture = createTestFixture('test-fixture', '');
            windowMock = GlobalMock.ofInstance(
                window.getComputedStyle,
                'getComputedStyle',
                window,
                MockBehavior.Strict,
            );
        });

        afterEach(() => {
            document.body.querySelector('#test-fixture').remove();
        });

        it('has bg image', () => {
            fixture.innerHTML = `
                <img id="el1" alt="" />
            `;
            const element1 = fixture.querySelector('#el1');
            windowMock
                .setup(m => m(It.isAny()))
                .returns(
                    node => ({ getPropertyValue: property => 'some-value' } as CSSStyleDeclaration),
                );
            let result;
            GlobalScope.using(windowMock).with(() => {
                result = AxeUtils.hasBackgoundImage(element1 as HTMLElement);
            });
            expect(result).toBeTruthy();
        });

        it('has bg image', () => {
            fixture.innerHTML = `
                <img id="el1" alt="" />
            `;
            const element1 = fixture.querySelector('#el1');
            windowMock
                .setup(m => m(It.isAny()))
                .returns(node => ({ getPropertyValue: property => 'none' } as CSSStyleDeclaration));
            let result;
            GlobalScope.using(windowMock).with(() => {
                result = AxeUtils.hasBackgoundImage(element1 as HTMLElement);
            });
            expect(result).toBeFalsy();
        });
    });

    describe('getImageType', () => {
        let fixture: HTMLElement;
        let windowMock: IGlobalMock<typeof window.getComputedStyle>;

        beforeEach(() => {
            fixture = createTestFixture('test-fixture', '');
            windowMock = GlobalMock.ofInstance(
                window.getComputedStyle,
                'getComputedStyle',
                window,
                MockBehavior.Strict,
            );
        });

        afterEach(() => {
            document.body.querySelector('#test-fixture').remove();
        });

        it('<img>', () => {
            fixture.innerHTML = `
                <img id="el1"/>
            `;
            const element1 = fixture.querySelector('#el1');
            windowMock
                .setup(m => m(It.isAny()))
                .returns(node => ({ getPropertyValue: property => 'none' } as CSSStyleDeclaration));
            let result;
            GlobalScope.using(windowMock).with(() => {
                result = AxeUtils.getImageType(element1 as HTMLElement);
            });
            expect(result).toEqual('<img>');
        });

        it('icon fonts (empty <i> elements)', () => {
            fixture.innerHTML = `
                <i id="el1" />
            `;
            const element1 = fixture.querySelector('#el1');
            windowMock
                .setup(m => m(It.isAny()))
                .returns(node => ({ getPropertyValue: property => 'none' } as CSSStyleDeclaration));
            let result;
            GlobalScope.using(windowMock).with(() => {
                result = AxeUtils.getImageType(element1 as HTMLElement);
            });
            expect(result).toEqual('icon fonts (empty <i> elements)');
        });

        it('Role="img"', () => {
            fixture.innerHTML = `
                <div id="el1" role='img'/> <div>
            `;
            const element1 = fixture.querySelector('#el1');
            windowMock
                .setup(m => m(It.isAny()))
                .returns(node => ({ getPropertyValue: property => 'none' } as CSSStyleDeclaration));
            let result;
            GlobalScope.using(windowMock).with(() => {
                result = AxeUtils.getImageType(element1 as HTMLElement);
            });
            expect(result).toEqual('Role="img"');
        });

        it('CSS background-image', () => {
            fixture.innerHTML = `
                <div id="el1"/> <div>
            `;
            const element1 = fixture.querySelector('#el1');
            windowMock
                .setup(m => m(It.isAny()))
                .returns(
                    node => ({ getPropertyValue: property => 'imgUrl' } as CSSStyleDeclaration),
                );
            let result;
            GlobalScope.using(windowMock).with(() => {
                result = AxeUtils.getImageType(element1 as HTMLElement);
            });
            expect(result).toEqual('CSS background-image');
        });
    });

    describe('getPropertyValuesMatching', () => {
        let fixture: HTMLElement;

        beforeEach(() => {
            fixture = createTestFixture('test-fixture', '');
        });

        afterEach(() => {
            document.body.querySelector('#test-fixture').remove();
        });

        it('should return empty dictionary if no properties matching regex', () => {
            fixture.innerHTML = `
                <img id="el1" />
            `;
            const element1 = fixture.querySelector('#el1');
            const result = AxeUtils.getPropertyValuesMatching(element1 as HTMLElement, /^test^/);
            expect(result).toEqual({});
        });

        it('should return proper dictionary with single attribute matching regex', () => {
            fixture.innerHTML = `
                <img id="el1" />
            `;
            const element1 = fixture.querySelector('#el1');
            const result = AxeUtils.getPropertyValuesMatching(element1 as HTMLElement, /^id/);
            expect(result).toEqual({
                id: 'el1',
            });
        });

        it('should return empty dictionary with single attribute not matching regex', () => {
            fixture.innerHTML = `
                <img id="el1" />
            `;
            const element1 = fixture.querySelector('#el1');
            const result = AxeUtils.getPropertyValuesMatching(element1 as HTMLElement, /^height/);
            expect(result).toEqual({});
        });

        it('should return dictionary with all attributes when all match regex', () => {
            fixture.innerHTML = `
                <img id="el1" height="40px" />
            `;
            const element1 = fixture.querySelector('#el1');
            const result = AxeUtils.getPropertyValuesMatching(element1 as HTMLElement, /^.*/);
            expect(result).toEqual({
                id: 'el1',
                height: '40px',
            });
        });

        it('should return dictionary with some attributes when some match regex', () => {
            fixture.innerHTML = `
                <img id="el1" height="40px" />
            `;
            const element1 = fixture.querySelector('#el1');
            const result = AxeUtils.getPropertyValuesMatching(element1 as HTMLElement, /^id/);
            expect(result).toEqual({
                id: 'el1',
            });
        });

        it('should return dictionary with some attributes when some match regex with *', () => {
            fixture.innerHTML = `
                <img id="el1" aria-label="hello" aria-owns="world" />
            `;
            const element1 = fixture.querySelector('#el1');
            const result = AxeUtils.getPropertyValuesMatching(element1 as HTMLElement, /^aria*/);
            expect(result).toEqual({
                'aria-label': 'hello',
                'aria-owns': 'world',
            });
        });
    });

    describe('hasCustomWidgetMarkup', () => {
        let fixture: HTMLElement;
        beforeEach(() => {
            fixture = createTestFixture('test-fixture', '');
        });

        afterEach(() => {
            document.body.querySelector('#test-fixture').remove();
        });

        it('returns true when tabindex is -1', () => {
            fixture.innerHTML = `
                <select id="el1" tabindex="-1" />
            `;
            const element = fixture.querySelector('#el1');
            const result = AxeUtils.hasCustomWidgetMarkup(element as HTMLElement);
            expect(result).toBe(true);
        });

        it('returns false when tabindex is 0', () => {
            fixture.innerHTML = `
                <select id="el1" tabindex="0" />
            `;
            const element = fixture.querySelector('#el1');
            const result = AxeUtils.hasCustomWidgetMarkup(element as HTMLElement);
            expect(result).toBe(false);
        });

        it('returns true when there is aria property', () => {
            fixture.innerHTML = `
                <select id="el1" aria-label="label" />
            `;
            const element = fixture.querySelector('#el1');
            const result = AxeUtils.hasCustomWidgetMarkup(element as HTMLElement);
            expect(result).toBe(true);
        });

        it('returns true when there is role', () => {
            fixture.innerHTML = `
                <select id="el1" role="application" />
            `;
            const element = fixture.querySelector('#el1');
            const result = AxeUtils.hasCustomWidgetMarkup(element as HTMLElement);
            expect(result).toBe(true);
        });
    });

    describe('getUniqueSelector', () => {
        const fixtureId = 'fixture-id';
        let fixture: HTMLElement;
        beforeEach(() => {
            fixture = createTestFixture(fixtureId, '');
        });

        afterEach(() => {
            document.body.querySelector(`#${fixtureId}`).remove();
        });

        it('Returns CSS selector which represents the input element', () => {
            expect(AxeUtils.getUniqueSelector(fixture)).toBe('#fixture-id');
        });

        it('Throws if axe.setup has already been invoked (ie, a scan is in progress)', () => {
            AxeUtils.withAxeSetup(() => {
                expect(() =>
                    AxeUtils.getUniqueSelector(fixture),
                ).toThrowErrorMatchingInlineSnapshot(
                    `"Axe is already setup. Call \`axe.teardown()\` before calling \`axe.setup\` again."`,
                );
            });
        });

        it('Does not leak an axe.setup state', () => {
            AxeUtils.getUniqueSelector(fixture);

            expect(() => AxeUtils.getUniqueSelector(fixture)).not.toThrow();
        });

        it('Does not leak an axe.setup state, even if an error occurs', () => {
            const nonfunctionalElement = {} as HTMLElement;
            expect(() => AxeUtils.getUniqueSelector(nonfunctionalElement)).toThrow();

            expect(() => AxeUtils.getUniqueSelector(fixture)).not.toThrow();
        });
    });

    describe('withAxeSetup', () => {
        it('Throws if axe.setup has already been invoked (ie, a scan is in progress)', () => {
            AxeUtils.withAxeSetup(() => {
                expect(() => AxeUtils.withAxeSetup(() => {})).toThrowErrorMatchingInlineSnapshot(
                    `"Axe is already setup. Call \`axe.teardown()\` before calling \`axe.setup\` again."`,
                );
            });
        });

        it('Does not leak an axe.setup state', () => {
            AxeUtils.withAxeSetup(() => {});

            expect(() => AxeUtils.withAxeSetup(() => {})).not.toThrow();
        });

        it('Propagates errors without leaking axe.setup state', () => {
            const testError = new Error('test error');
            expect(() =>
                AxeUtils.withAxeSetup(() => {
                    throw testError;
                }),
            ).toThrowError(testError);

            expect(() => AxeUtils.withAxeSetup(() => {})).not.toThrow();
        });
    });

    function createTestFixture(id: string, content: string): HTMLDivElement {
        const testFixture: HTMLDivElement = document.createElement('div');
        testFixture.setAttribute('id', id);
        document.body.appendChild(testFixture);
        testFixture.innerHTML = content;
        return testFixture;
    }
});
