// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash';

import { IInlineImageProps, InlineImage, InlineImageType } from '../../../../../../DetailsView/reports/components/inline-image';

describe('InlineImageTest', () => {
    test('Valid types return <img> elements', () => {
        testInlineImage(InlineImageType.InsightsLogo48, '');
        testInlineImage(InlineImageType.PassIcon, 'Pass icon');
        testInlineImage(InlineImageType.FailIcon, 'Fail icon');
        testInlineImage(InlineImageType.NotApplicableIcon, 'Not applicable icon');
        testInlineImage(InlineImageType.AdaTheCat, 'Ada the cat');
    });

    test('Invalid type returns null', () => {
        testInvalidImage(1234);
    });

    function testInvalidImage(type: InlineImageType): void {
        const props: IInlineImageProps = { type, alt: '' };
        const testObject = new InlineImage(props);

        const element = testObject.render();

        expect(element).toBeNull();
    }

    function testInlineImage(type: InlineImageType, alt: string): void {
        const props: IInlineImageProps = { type, alt };
        const testObject = new InlineImage(props);

        const element = testObject.render();

        expect(element.type).toEqual('img');
        expect(_.startsWith(element.props.src, 'data:image/png;base64,iVBO')).toBeTruthy();
        expect(element.props.alt).toEqual(alt);
    }
});
