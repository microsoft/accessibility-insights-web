// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { ManualTestStatus } from '../../../../../common/types/manual-test-status';
import {
    RequirementLink,
    RequirementLinkProps,
} from '../../../../../DetailsView/components/requirement-link';

describe('RequirementLink', () => {
    it('renders with index', () => {
        const link = {
            key: 'Link with index key',
            name: 'Link with index name',
            description: <span>Link with index description</span>,
            url: '',
            index: 5,
            forceAnchor: true,
        };
        const props: RequirementLinkProps = {
            link: link,
            status: ManualTestStatus.PASS,
            renderRequirementDescription: requirementLink =>
                requirementLink.renderRequirementDescriptionWithIndex(),
        };
        const testSubject = new RequirementLink(props);

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
        const props: RequirementLinkProps = {
            link: link,
            status: ManualTestStatus.PASS,
            renderRequirementDescription: requirementLink =>
                requirementLink.renderRequirementDescriptionWithoutIndex(),
        };
        const testSubject = new RequirementLink(props);

        expect(testSubject.render()).toMatchSnapshot();
    });
});
