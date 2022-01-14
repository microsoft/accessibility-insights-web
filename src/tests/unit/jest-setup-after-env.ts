// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

afterEach(async () => {
    try {
        await new Promise(process.nextTick);
    } catch (e) {
        console.log(e);
    }
});
