// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { ManualTestStatus } from '../../../../common/types/manual-test-status';
import { ITestStepLinkProps, TestStepLink } from '../../../../DetailsView/components/test-step-link';

describe('TestStepLink', () => {

    it('renders with index', () => {
        const link = {
            key: 'Link with index key',
            name: 'Link with index name',
            description: <span>Link with index description</span>,
            url: '',
            index: 5,
            forceAnchor: true,
        };
        const props: ITestStepLinkProps = {
            link: link,
            status: ManualTestStatus.PASS,
            renderRequirementDescription: testStepLink => testStepLink.renderRequirementDescriptionWithIndex(),
        };
        const testSubject = new TestStepLink(props);

        expect(testSubject.render()).toMatchSnapshot();
    });

    it('renders without index', () => {
        const link = {
            key: 'Link without index key',
            name: 'Link without index name',
            description: <span>Link without index description</span>,
            url: '',
            index: 17,
            forceAnchor: true,
        };
        const props: ITestStepLinkProps = {
            link: link,
            status: ManualTestStatus.PASS,
            renderRequirementDescription: testStepLink => testStepLink.renderRequirementDescriptionWithoutIndex(),
        };
        const testSubject = new TestStepLink(props);

        expect(testSubject.render()).toMatchSnapshot();
    });

});
