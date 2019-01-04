// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
interface String {
    toTitleCase: () => string;
}

String.prototype.toTitleCase = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};
