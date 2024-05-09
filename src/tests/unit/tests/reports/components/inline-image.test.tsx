// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { InlineImage, InlineImageProps, InlineImageType } from 'reports/components/inline-image';
import '@testing-library/jest-dom';

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
        testInvalidImage(1234 as InlineImageType);
    });

    test('optional class name', () => {
        const testClassName = 'test-class-name';
        const renderResult = render(
            <InlineImage
                imageType={InlineImageType.SleepingAda}
                alt=""
                className={testClassName}
            />,
        );

        expect(renderResult.container.getElementsByClassName(testClassName)).toBeTruthy();
    });

    function testInvalidImage(imageType: InlineImageType): void {
        const props: InlineImageProps = { imageType, alt: '' };

        const renderResult = render(<InlineImage {...props} />);

        expect(renderResult.container.firstChild).toBeNull();
    }

    function testInlineImage(imageType: InlineImageType, alt: string): void {
        const props: InlineImageProps = { imageType, alt };

        const renderResult = render(<InlineImage {...props} />);
        expect(renderResult.container.firstChild).not.toBeNull();

        const element = renderResult.getByRole('img', { name: alt }) as HTMLImageElement;
        expect(element.src).toContain('data:image/png;base64,iVBO');
        expect(element.alt).toEqual(alt);
    }
});
