// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScopingInputTypes } from '../../../background/actions/scoping-inputs';

export type ISingleElementSelector = string[];
// tslint:disable-next-line:interface-name
export interface IScopingStoreData {
    selectors: {
        [key: ScopingInputTypes]: ISingleElementSelector[];
    };
}
