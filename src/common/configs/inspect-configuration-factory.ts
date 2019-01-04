// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

import { InspectMode } from '../../background/inspect-modes';
import { ScopingInputTypes } from '../../background/scoping-input-types';
import { ScopingActionMessageCreator } from '../message-creators/scoping-action-message-creator';
import { ISingleElementSelector } from '../types/store-data/scoping-store-data';



export type IInspectCallback = (event: MouseEvent, selector: ISingleElementSelector) => void;

export class InspectConfigurationFactory {
    private scopingActionMessageCreator: ScopingActionMessageCreator;
    constructor(scopingActionMessageCreator: ScopingActionMessageCreator) {
        this.scopingActionMessageCreator = scopingActionMessageCreator;
    }

    private configurationByType: IDictionaryNumberTo<IInspectCallback> = {
        [InspectMode.scopingAddInclude]: this.addIncludeSelector,
        [InspectMode.scopingAddExclude]: this.addExcludeSelector,
    };

    public getConfigurationByKey(key: string): ((event: MouseEvent, selector: string[]) => void) {
        const configuration =  this.configurationByType[key];
        if (configuration == null) {
            throw new Error(`Unsupported type: ${key}`);
        }
        return configuration;
    }

    @autobind
    private addIncludeSelector(event: MouseEvent, selector: string[]): void {
        this.scopingActionMessageCreator.addSelector(event, ScopingInputTypes.include, selector);
    }

    @autobind
    private addExcludeSelector(event: MouseEvent, selector: string[]): void {
       this.scopingActionMessageCreator.addSelector(event, ScopingInputTypes.exclude, selector);
    }
}
