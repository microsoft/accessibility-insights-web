// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ContentUrlDecorator } from './content-url-decorator';

export const ElectronUrlDecorator: ContentUrlDecorator = (url: string) => {
    return `file:///${__dirname}/..${url}`;
};
