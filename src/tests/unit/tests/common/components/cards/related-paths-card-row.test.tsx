// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import {
    RelatedPathsCardRow,
    RelatedPathsCardRowProps,
} from 'common/components/cards/related-paths-card-row';
import { SimpleCardRow } from 'common/components/cards/simple-card-row';
import * as React from 'react';
import { mockReactComponents } from 'tests/unit/mock-helpers/mock-module-helpers';

jest.mock('common/components/cards/simple-card-row');
describe(RelatedPathsCardRow.displayName, () => {
    mockReactComponents([SimpleCardRow]);
    it.each([[], null, undefined])(
        'renders as null with related paths: %p',
        (relatedPaths?: any) => {
            const props: RelatedPathsCardRowProps = {
                deps: null,
                index: 123,
                propertyData: relatedPaths,
            };
            const renderResult = render(<RelatedPathsCardRow {...props} />);

            expect(renderResult.container.firstChild).toBeNull();
        },
    );

    it('renders matching snapshot with related paths present', () => {
        const props: RelatedPathsCardRowProps = {
            deps: null,
            index: 123,
            propertyData: ['#path-1a;.path-1b', '#path-2', '.path-3'],
        };
        const renderResult = render(<RelatedPathsCardRow {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
