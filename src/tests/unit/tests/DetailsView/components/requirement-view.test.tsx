// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Requirement } from 'assessments/types/requirement';
import {
    RequirementView,
    RequirementViewDeps,
    RequirementViewProps,
} from 'DetailsView/components/requirement-view';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('RequirementViewTest', () => {
    it('renders with content from props', () => {
        const requirementStub = {
            name: 'test-requirement-name',
            description: <div>test-description</div>,
        } as Requirement;

        const props: RequirementViewProps = {
            deps: {} as RequirementViewDeps,
            requirement: requirementStub,
        };

        const rendered = shallow(<RequirementView {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });
});
