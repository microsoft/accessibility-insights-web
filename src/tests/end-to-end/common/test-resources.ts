// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export function getTestResourceUrl(path: string) {
    const testResourceServerPort: number = 8479;
    return `http://localhost:${testResourceServerPort}/${path}`;
}
