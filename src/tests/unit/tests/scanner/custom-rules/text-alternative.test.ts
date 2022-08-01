// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { withAxeSetup } from 'scanner/axe-utils';
import { textAlternativeConfiguration } from 'scanner/custom-rules/text-alternative';
import { IMock, It, Mock, Times } from 'typemoq';

describe('text alternative', () => {
    describe('verify text alternative configs', () => {
        it('should have correct props', () => {
            expect(textAlternativeConfiguration.rule.id).toBe('accessible-image');
            expect(textAlternativeConfiguration.rule.selector).toBe('*');
            expect(textAlternativeConfiguration.rule.any[0]).toBe(
                'text-alternative-data-collector',
            );
            expect(textAlternativeConfiguration.rule.all).toEqual([]);
            expect(textAlternativeConfiguration.rule.all.length).toBe(0);
            expect(textAlternativeConfiguration.rule.any.length).toBe(1);
            expect(textAlternativeConfiguration.checks[0].id).toBe(
                'text-alternative-data-collector',
            );
        });
    });

    describe('verify matches', () => {
        let fixture: HTMLElement;

        beforeEach(() => {
            fixture = createTestFixture('test-fixture', '');
        });

        afterEach(() => {
            document.body.querySelector('#test-fixture').remove();
        });

        it('should match meaningful image', () => {
            fixture.innerHTML = `
                <img id="el1" aria-labelledby="el3" />
                <img id="el2" aria-labelledby="el1" />
                <div id="el3"> hello </div>
            `;

            const element1 = fixture.querySelector('#el1');
            const result = withAxeSetup(() =>
                textAlternativeConfiguration.rule.matches(element1, null),
            );

            expect(result).toBe(true);
        });

        it('should not match img elements with alt = "" ', () => {
            fixture.innerHTML = `
                <img id="el1" aria-labelledby="el3" />
                <img id="el2" aria-labelledby="el1" alt = "" />
                <div id="el3"> hello </div>
            `;

            const element2 = fixture.querySelector('#el2');
            const result = withAxeSetup(() =>
                textAlternativeConfiguration.rule.matches(element2, null),
            );

            expect(result).toBe(false);
        });

        it('should match img elements with space as alt', () => {
            fixture.innerHTML = `
                <img id="el1" alt=" "/>
            `;

            const element = fixture.querySelector('#el1');
            const result = withAxeSetup(() =>
                textAlternativeConfiguration.rule.matches(element, null),
            );

            expect(result).toBe(true);
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
            const result = withAxeSetup(() =>
                textAlternativeConfiguration.checks[0].evaluate.call(
                    { data: dataSetterMock.object },
                    element1,
                ),
            );
            expect(result).toBe(true);
        });

        it('set property bag properly', () => {
            fixture.innerHTML = `
                <img id="el1" aria-describedby="el3" alt="accessibleName"/>
                <img id="el2" aria-labelledby="el3" />
                <div id="el3"> hello </div>
            `;

            const element1 = fixture.querySelector('#el1');

            const expectedData = {
                imageType: '<img>',
                accessibleName: 'accessibleName',
                accessibleDescription: 'hello',
                role: null,
            };
            dataSetterMock.setup(d => d(It.isValue(expectedData))).verifiable(Times.once());
            const result = withAxeSetup(() =>
                textAlternativeConfiguration.checks[0].evaluate.call(
                    { data: dataSetterMock.object },
                    element1,
                ),
            );
            expect(result).toBe(true);
            dataSetterMock.verifyAll();
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
