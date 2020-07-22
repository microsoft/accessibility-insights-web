// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DictionaryStringTo } from 'types/common-types';
import { AxeNodeResult } from '../../scanner/iruleresults';

export type ResolutionCreator = (data: ResolutionCreatorData) => DictionaryStringTo<any>;

export interface ResolutionCreatorData {
    id: string;
    nodeResult: AxeNodeResult;
}

export const getFixResolution: ResolutionCreator = (data: ResolutionCreatorData) => {
    return {
        'how-to-fix-web': {
            any: data.nodeResult.any.map(checkResult => checkResult.message),
            none: data.nodeResult.none.map(checkResult => checkResult.message),
            all: data.nodeResult.all.map(checkResult => checkResult.message),
        },
    };
};

export const getCheckResolution: ResolutionCreator = (data: ResolutionCreatorData) => {
    return {
        'how-to-check-web': data.id,
    };
};
