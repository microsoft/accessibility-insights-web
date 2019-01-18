// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { getInnerTextFromJsxElement } from '../../../../common/get-inner-text-from-jsx-element';

describe('Get Inner Text from jsx element', () => {

    it('should return inner text for nested elements', () => {
        const jsxContent = (
            <div id={'div1'}>
                sample {' '}
                 <span className={'span1'}>
                    text inside jsx {' '}
                 </span>
                <i>123</i>
            </div>
        );
        const expectedString = 'sample text inside jsx 123';
        const actualString = getInnerTextFromJsxElement(jsxContent);

        expect(actualString).toBe(expectedString);
    });

    it('should return inner text for simple 1 level element', () => {
        const jsxContent = <div> sample content </div>;
        const expectedString = 'sample content';
        const actualString = getInnerTextFromJsxElement(jsxContent);

        expect(actualString).toBe(expectedString);
    });

    it('should return inner text for string', () => {
        const jsxContent = ('sample content');
        const expectedString = 'sample content';
        const actualString = getInnerTextFromJsxElement(jsxContent as any);

        expect(actualString).toBe(expectedString);
    });

    it('should return inner text for number', () => {
        const jsxContent = (123);
        const expectedString = '123';
        const actualString = getInnerTextFromJsxElement(jsxContent as any);

        expect(actualString).toBe(expectedString);
    });

    it('should return inner text for boolean', () => {
        const jsxContent = (true);
        const expectedString = 'true';
        const actualString = getInnerTextFromJsxElement(jsxContent as any);

        expect(actualString).toBe(expectedString);
    });
});
