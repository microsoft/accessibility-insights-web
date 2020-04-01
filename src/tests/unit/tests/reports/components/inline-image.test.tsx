// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { startsWith } from 'lodash';
import * as React from 'react';
import { InlineImage, InlineImageProps, InlineImageType } from 'reports/components/inline-image';

describe('InlineImageTest', () => {
    test('Valid types return <img> elements', () => {
        testInlineImage(InlineImageType.InsightsLogo48, '');
        testInlineImage(InlineImageType.PassIcon, 'Pass icon');
        testInlineImage(InlineImageType.FailIcon, 'Fail icon');
        testInlineImage(InlineImageType.NotApplicableIcon, 'Not applicable icon');
        testInlineImage(InlineImageType.AdaTheCat, 'Ada the cat');
        testInlineImage(InlineImageType.SleepingAda, 'Sleeping Ada');
    });

    test('Invalid type returns null', () => {
        testInvalidImage(1234);
    });

    test('optional class name', () => {
        const testClassName = 'test-class-name';
        const wrapped = shallow(
            <InlineImage
                imageType={InlineImageType.SleepingAda}
                alt=""
                className={testClassName}
            />,
        );

        const element = wrapped.getElement();

        expect(element.props.className).toEqual(testClassName);
    });

    function testInvalidImage(imageType: InlineImageType): void {
        const props: InlineImageProps = { imageType, alt: '' };

        const wrapped = shallow(<InlineImage {...props} />);

        expect(wrapped.getElement()).toBeNull();
    }

    function testInlineImage(imageType: InlineImageType, alt: string): void {
        const props: InlineImageProps = { imageType, alt };

        const wrapped = shallow(<InlineImage {...props} />);

        const element = wrapped.getElement();

        expect(element.type).toEqual('img');
        expect(startsWith(element.props.src, 'data:image/png;base64,iVBO')).toBeTruthy();
        expect(element.props.alt).toEqual(alt);
    }
});
