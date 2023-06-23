// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    RichResolutionContent,
    RichResolutionContentDeps,
    RichResolutionContentProps,
} from 'common/components/cards/rich-resolution-content';
import { LinkComponentType } from 'common/types/link-component-type';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('RichResolutionContent', () => {
    const stubLinkComponent: LinkComponentType = ({ href, children }) => (
        <a href={href}>{children}</a>
    );
    const deps: RichResolutionContentDeps = { LinkComponent: stubLinkComponent };

    it.each([
        'web/aria-input-field-name',
        'web/color-contrast',
        'web/th-has-data-cells',
        'web/scrollable-region-focusable',
        'web/label-content-name-mismatch',
        'web/p-as-heading',
    ])('renders static content with id=%s', testId => {
        const props: RichResolutionContentProps = {
            deps,
            contentId: testId,
        };

        const testSubject = shallow(<RichResolutionContent {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });

    it('throws when given an unrecognized contentId', () => {
        const props: RichResolutionContentProps = {
            deps,
            contentId: 'bogus-id',
        };

        expect(() => shallow(<RichResolutionContent {...props} />)).toThrowError(/bogus-id/);
    });
});
