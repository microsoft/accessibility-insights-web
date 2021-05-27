// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RecommendColor } from 'common/components/recommend-color';


describe('Recommend Color', () => {
    let testSubject: RecommendColor;
    //let color1 = '#FFFFFF';
    //let color2 = '#000000';

    /* beforeEach(() => {
        testSubject = new RecommendColor(color1, color2, 4.5);
    }); */
    test('Fake Test One', () => {
        testSubject = new RecommendColor('#ffffff', '#000000', 4.5);
        console.log(testSubject.sentence);
        expect(true).toBeTruthy();
    });
});
