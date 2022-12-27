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
        'android/ColorContrast',
        'android/ActiveViewName',
        'android/ImageViewName',
        'android/EditTextValue',
        'web/aria-input-field-name',
        'web/color-contrast',
        'web/th-has-data-cells',
        'web/link-in-text-block',
        'web/scrollable-region-focusable',
        'web/label-content-name-mismatch',
        'web/p-as-heading',
        'android/atfa/ClassNameCheck',
        'android/atfa/ClickableSpanCheck',
        'android/atfa/DuplicateClickableBoundsCheck',
        'android/atfa/DuplicateSpeakableTextCheck',
        'android/atfa/LinkPurposeUnclearCheck',
        'android/atfa/RedundantDescriptionCheck',
        'android/atfa/TraversalOrderCheck',
        'android/atfa/TextContrastCheck',
        'android/atfa/ImageContrastCheck',
    ])('renders static content with id=%s', testId => {
        const props: RichResolutionContentProps = {
            deps,
            contentId: testId,
        };

        const testSubject = shallow(<RichResolutionContent {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });

    it('renders android/TouchSizeWcag using contentVariables', () => {
        const props: RichResolutionContentProps = {
            deps,
            contentId: 'android/TouchSizeWcag',
            contentVariables: {
                logicalWidth: 'LOGICAL_WIDTH_VALUE',
                logicalHeight: 'LOGICAL_HEIGHT_VALUE',
            },
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
