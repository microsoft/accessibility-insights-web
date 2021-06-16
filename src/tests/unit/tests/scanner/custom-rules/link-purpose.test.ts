// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GlobalMock, GlobalScope, IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import * as AxeUtils from '../../../../../scanner/axe-utils';
import { linkPurposeConfiguration } from '../../../../../scanner/custom-rules/link-purpose';

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
        const getAccessibleTextMock = GlobalMock.ofInstance(
            AxeUtils.getAccessibleText,
            'getAccessibleText',
            AxeUtils,
            MockBehavior.Strict,
        );
        const getAccessibleDescriptionMock = GlobalMock.ofInstance(
            AxeUtils.getAccessibleDescription,
            'getAccessibleDescription',
            AxeUtils,
            MockBehavior.Strict,
        );

        beforeEach(() => {
            dataSetterMock = Mock.ofInstance(data => {});
            getAccessibleTextMock.setup(m => m(It.isAny())).returns(_ => 'accessible-text');
            getAccessibleDescriptionMock
                .setup(m => m(It.isAny()))
                .returns(_ => 'accessible-description');
        });

        it('get the right data', () => {
            const url = 'some-url';
            const nodeStub = {
                getAttribute: attr => url,
            } as HTMLElement;

            const expectedData = {
                element: 'link',
                accessibleName: 'accessible-text',
                accessibleDescription: 'accessible-description',
                url,
            };

            dataSetterMock.setup(m => m(It.isValue(expectedData))).verifiable(Times.once());

            let result;
            GlobalScope.using(getAccessibleTextMock, getAccessibleDescriptionMock).with(() => {
                result = linkPurposeConfiguration.checks[0].evaluate.call(
                    { data: dataSetterMock.object },
                    nodeStub,
                );
            });
            expect(result).toBe(true);
            dataSetterMock.verifyAll();
        });
    });
});
