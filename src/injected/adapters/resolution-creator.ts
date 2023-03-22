// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FormattedCheckResult } from 'common/types/store-data/visualization-scan-result-data';
import { DictionaryStringTo } from 'types/common-types';

export type ResolutionCreator = (data: ResolutionCreatorData) => DictionaryStringTo<any>;

export interface NodeResolutionData {
    any: FormattedCheckResult[];
    none: FormattedCheckResult[];
    all: FormattedCheckResult[];
}

export interface ResolutionCreatorData {
    ruleId: string;
    nodeResult: NodeResolutionData;
}

export const getFixResolution: ResolutionCreator = (data: ResolutionCreatorData) => {
    return {
        'how-to-fix-web': {
            any: data.nodeResult.any?.map(checkResult => checkResult.message),
            none: data.nodeResult.none?.map(checkResult => checkResult.message),
            all: data.nodeResult.all?.map(checkResult => checkResult.message),
        },
    };
};

export const getCheckResolution: ResolutionCreator = (data: ResolutionCreatorData) => {
    return {
        richResolution: {
            labelType: 'check',
            contentId: `web/${data.ruleId}`,
        },
    };
};
