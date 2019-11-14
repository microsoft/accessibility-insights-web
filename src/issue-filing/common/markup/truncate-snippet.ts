// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { truncate } from 'lodash';
export const maxSnippetLength = 256;

export const truncateSnippet = (text: string) =>
    truncate(text, { length: maxSnippetLength });
