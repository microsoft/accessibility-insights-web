// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    RelatedPathsCardRow,
    RelatedPathsCardRowProps,
} from 'common/components/cards/related-paths-card-row';
import { shallow } from 'enzyme';
import * as React from 'react';

describe(RelatedPathsCardRow.displayName, () => {
    it.each([[], null, undefined])(
        'renders as null with related paths: %p',
        (relatedPaths?: any) => {
            const props: RelatedPathsCardRowProps = {
                deps: null,
                index: 123,
                propertyData: relatedPaths,
            };
            const testSubject = shallow(<RelatedPathsCardRow {...props} />);

            expect(testSubject.getElement()).toBeNull();
        },
    );

    it('renders matching snapshot with related paths present', () => {
        const props: RelatedPathsCardRowProps = {
            deps: null,
            index: 123,
            propertyData: ['#path-1a;.path-1b', '#path-2', '.path-3'],
        };
        const testSubject = shallow(<RelatedPathsCardRow {...props} />);

        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
