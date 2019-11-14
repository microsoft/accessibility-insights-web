// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InstanceIdentifierGenerator } from 'background/instance-identifier-generator';

describe('InstanceIdentifierGeneratorTest', () => {
    it('generateSelectorIdentifier', () => {
        const expectedSelector = 'some selector';
        const instanceStub = {
            target: [expectedSelector],
        };
        const actual = InstanceIdentifierGenerator.generateSelectorIdentifier(
            instanceStub,
        );
        expect(actual).toEqual(expectedSelector);
    });
    it('defaultIdentifier', () => {
        const html = 'some html';
        const selector = 'some selector';
        const expected = 'some html,some selector';
        const instanceStub = {
            html: html,
            target: [selector],
        };
        const actual = InstanceIdentifierGenerator.defaultHtmlSelectorIdentifier(
            instanceStub,
        );
        expect(actual).toEqual(expected);
    });
});
