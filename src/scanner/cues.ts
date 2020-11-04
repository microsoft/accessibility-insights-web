// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DictionaryStringTo } from '../types/common-types';
import { getAttributes } from './axe-utils';

const htmlCues = ['readonly', 'disabled', 'required'];
const ariaCues = ['aria-readonly', 'aria-disabled', 'aria-required'];

export function generateHTMLCuesDictionary(node: HTMLElement): DictionaryStringTo<string | null> {
    return getAttributes(node, htmlCues);
}

export function generateARIACuesDictionary(node: HTMLElement): DictionaryStringTo<string | null> {
    return getAttributes(node, ariaCues);
}
