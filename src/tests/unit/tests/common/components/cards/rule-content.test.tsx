// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { InstanceDetailsGroup } from 'common/components/cards/instance-details-group';
import { RuleContent, RuleContentProps } from 'common/components/cards/rule-content';
import * as React from 'react';
import {
    getNeedsReviewRuleResourcesUrl,
    isOutcomeNeedsReview,
} from '../../../../../../common/configs/needs-review-rule-resources';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { RuleResources } from '../../../../../../common/components/cards/rule-resources';
jest.mock('common/components/cards/instance-details-group');
jest.mock('../../../../../../common/components/cards/rule-resources');
describe('RuleContent', () => {
    mockReactComponents([InstanceDetailsGroup, RuleResources]);
    it('renders', () => {
        const props = {
            rule: {
                id: 'test-id',
            },
            deps: {
                GetNeedsReviewRuleResourcesUrl: getNeedsReviewRuleResourcesUrl,
                IsOutcomeNeedsReview: isOutcomeNeedsReview,
            },
        } as RuleContentProps;

        const renderResult = render(<RuleContent {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([InstanceDetailsGroup, RuleResources]);
    });
});
