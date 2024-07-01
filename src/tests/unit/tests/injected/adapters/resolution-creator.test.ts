// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    getCheckResolution,
    getFixResolution,
    ResolutionCreatorData,
} from 'injected/adapters/resolution-creator';

describe('ResolutionCreator', () => {
    it('outputs correct fix resolution with undefined properties', () => {
        const resolutionCreatorDataStub: ResolutionCreatorData = {
            ruleId: 'rule id',
            nodeResult: {
                any: undefined,
                all: undefined,
                none: undefined,
            },
        };

        const expected = {
            'how-to-fix-web': {
                any: undefined,
                none: undefined,
                all: undefined,
            },
        };

        const actual = getFixResolution(resolutionCreatorDataStub);
        expect(actual).toEqual(expected);
    });

    it('outputs correct fix resolution with no data', () => {
        const resolutionCreatorDataStub: ResolutionCreatorData = {
            ruleId: 'rule id',
            nodeResult: {
                any: [],
                all: [],
                none: [],
            },
        };

        const expected = {
            'how-to-fix-web': {
                any: [],
                none: [],
                all: [],
            },
        };

        const actual = getFixResolution(resolutionCreatorDataStub);
        expect(actual).toEqual(expected);
    });

    it('outputs correct fix resolution with data', () => {
        const resolutionCreatorDataStub: ResolutionCreatorData = {
            ruleId: 'rule id',
            nodeResult: {
                any: [
                    { id: null, message: 'any 1 message', data: null },
                    { id: null, message: 'any 2 message', data: null },
                ],
                all: [{ id: null, message: 'all 1 message', data: null }],
                none: [{ id: null, message: 'none 1 message', data: null }],
            },
        };

        const expected = {
            'how-to-fix-web': {
                all: ['all 1 message'],
                any: ['any 1 message', 'any 2 message'],
                none: ['none 1 message'],
            },
        };

        const actual = getFixResolution(resolutionCreatorDataStub);
        expect(actual).toEqual(expected);
    });

    it('outputs correct check resolution', () => {
        const ruleId = 'test-rule-id';
        const resolutionCreatorDataStub: ResolutionCreatorData = {
            ruleId: ruleId,
            nodeResult: {
                any: [],
                all: [],
                none: [],
            },
        };

        const expected = {
            richResolution: {
                labelType: 'check',
                contentId: 'web/test-rule-id',
            },
        };

        const actual = getCheckResolution(resolutionCreatorDataStub);
        expect(actual).toEqual(expected);
    });
});
