// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InspectMode } from 'common/types/store-data/inspect-modes';
import { ScopingInputTypes } from 'common/types/store-data/scoping-input-types';
import { DictionaryStringTo } from '../../types/common-types';
import { ScopingActionMessageCreator } from '../message-creators/scoping-action-message-creator';
import { SingleElementSelector } from '../types/store-data/scoping-store-data';

export type IInspectCallback = (event: MouseEvent, selector: SingleElementSelector) => void;

export type ConfigurationKey = Exclude<InspectMode, 'off'>;

export class InspectConfigurationFactory {
    private scopingActionMessageCreator: ScopingActionMessageCreator;
    constructor(scopingActionMessageCreator: ScopingActionMessageCreator) {
        this.scopingActionMessageCreator = scopingActionMessageCreator;
    }

    private addIncludeSelector = (event: MouseEvent, selector: string[]): void => {
        this.scopingActionMessageCreator.addSelector(event, ScopingInputTypes.include, selector);
    };

    private addExcludeSelector = (event: MouseEvent, selector: string[]): void => {
        this.scopingActionMessageCreator.addSelector(event, ScopingInputTypes.exclude, selector);
    };

    private configurationByType: DictionaryStringTo<IInspectCallback> = {
        [InspectMode.scopingAddInclude]: this.addIncludeSelector,
        [InspectMode.scopingAddExclude]: this.addExcludeSelector,
    };

    public getConfigurationByKey(
        key: ConfigurationKey,
    ): (event: MouseEvent, selector: string[]) => void {
        const configuration = this.configurationByType[key];

        if (configuration == null) {
            throw new Error(`Unsupported type: ${key}`);
        }

        return configuration;
    }
}
