// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export type UrlRectifier = (url: string) => string;

export const rectify: UrlRectifier = (url: string): string => {
    const ownerAndRepo = new RegExp('^https?://github.com/[^/]+/[^/]+$');
    if (ownerAndRepo.test(url)) {
        return `${url}/issues`;
    }

    const ownerAndRepoAndSlash = new RegExp(
        '^https?://github.com/[^/]+/[^/]+/$',
    );
    if (ownerAndRepoAndSlash.test(url)) {
        return `${url}issues`;
    }

    return url;
};
