// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { withAxeSetup } from 'scanner/axe-utils';
import { linkPurposeConfiguration } from 'scanner/custom-rules/link-purpose';
import { IMock, It, Mock, Times } from 'typemoq';

describe('link purpose', () => {
    describe('verify link purpose configs', () => {
        it('should have correct props', () => {
            expect(linkPurposeConfiguration.rule.id).toBe('link-purpose');
            expect(linkPurposeConfiguration.rule.selector).toBe('a');
            expect(linkPurposeConfiguration.rule.matches).toBeUndefined();
            expect(linkPurposeConfiguration.rule.any[0]).toBe('link-purpose');
            expect(linkPurposeConfiguration.rule.none[0]).toBe('has-widget-role');
            expect(linkPurposeConfiguration.rule.all[0]).toBe('valid-role-if-present');
            expect(linkPurposeConfiguration.rule.any.length).toBe(1);
            expect(linkPurposeConfiguration.rule.none.length).toBe(1);
            expect(linkPurposeConfiguration.rule.all.length).toBe(1);
            expect(linkPurposeConfiguration.checks[0].id).toBe('link-purpose');
            expect(linkPurposeConfiguration.checks[1].id).toBe('valid-role-if-present');
        });
    });

    describe('verify evaluate', () => {
        let dataSetterMock: IMock<(data) => void>;

        beforeEach(() => {
            dataSetterMock = Mock.ofInstance(data => {});
        });

        afterEach(() => {
            document.body.innerHTML = '';
        });

        it('gets the right data', () => {
            const accessibleName = 'accessible name';
            const accessibleDescription = 'accessible description';
            const url = 'some-url';

            document.body.innerHTML = `
                <a id="node-under-test" href="${url}" aria-describedby="description">${accessibleName}</a>
                <div id="description">${accessibleDescription}</div>
            `;

            const nodeUnderTest = document.body.querySelector('#node-under-test');

            const expectedData = {
                element: 'link',
                accessibleName,
                accessibleDescription,
                url,
            };

            dataSetterMock.setup(m => m(It.isValue(expectedData))).verifiable(Times.once());

            const result = withAxeSetup(() =>
                linkPurposeConfiguration.checks[0].evaluate.call(
                    { data: dataSetterMock.object },
                    nodeUnderTest,
                ),
            );
            expect(result).toBe(true);
            dataSetterMock.verifyAll();
        });
    });
});
