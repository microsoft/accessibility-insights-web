// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RecommendColor } from 'common/components/recommend-color';

describe('Recommend Color', () => {
    let testSubject: RecommendColor;

    beforeEach(() => {
        testSubject = new RecommendColor();
    });

    test('White on White recommendation', () => {
        testSubject.getRecommendColor('#ffffff', '#ffffff', 4.5);

        const result = testSubject.sentence;

        expect(result).toMatchSnapshot();
    });

    test('Black on black recommendation', () => {
        testSubject.getRecommendColor('#000000', '#000000', 4.5);

        const result = testSubject.sentence;

        expect(result).toMatchSnapshot();
    });

    test('Same Color recommendation', () => {
        testSubject.getRecommendColor('#8a94a8', '#8a94a8', 4.5);

        const result = testSubject.sentence;

        expect(result).toMatchSnapshot();
    });

    test('Normal Font Recommendation', () => {
        testSubject.getRecommendColor('#fefefe', '#21809d', 4.5);

        const result = testSubject.sentence;

        expect(result).toMatchSnapshot();
    });

    test('Large Font Recommendation', () => {
        testSubject.getRecommendColor('#0000D6', '#9A3743', 3.0);

        const result = testSubject.sentence;

        expect(result).toMatchSnapshot();
    });

    test('Incorrect Input', () => {
        testSubject.getRecommendColor('color', 'color', 4.5);

        const result = testSubject.sentence;

        expect(result).toMatchSnapshot();
    });
});
