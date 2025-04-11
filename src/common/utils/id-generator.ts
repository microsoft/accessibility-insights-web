// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export function generateDeterministicContentId(content: string): string {
    if (!content) {
        return 'empty';
    }

    let hash = 5381;
    for (let i = 0; i < content.length; i++) {
        hash = ((hash << 5) + hash) + content.charCodeAt(i);
    }

    return (hash >>> 0).toString(36);
}
