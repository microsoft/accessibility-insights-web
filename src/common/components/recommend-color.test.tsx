// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RecommendColor } from 'common/components/recommend-color';

test('Fake Test One', () => {
    expect(true).toBeTruthy();
});

describe('Recommend Color', () => {
    let testSubject: RecommendColor;
    let color1 = '#FFFFFF';
    let color2 = '#000000';

    beforeEach(() => {
        testSubject = new RecommendColor(color1, color2);
    });

    test('Fake Test One', () => {
        expect(true).toBeTruthy();
    });
});
