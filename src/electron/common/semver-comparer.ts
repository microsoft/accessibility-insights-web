// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export enum SemverComparisonResult {
    V1LessThanV2 = -1,
    V1EqualToV2 = 0,
    V1GreaterThanV2 = 1,
}

// This is an extremely limited version, good enough for our immediate needs
type SemVerElements = {
    major: number;
    minor: number;
    patch?: number;
};

export function compareSemverValues(v1: string, v2: string): SemverComparisonResult {
    const v1Elements: SemVerElements = splitSemVer(v1);
    const v2Elements: SemVerElements = splitSemVer(v2);

    if (
        v1Elements.major > v2Elements.major ||
        (v1Elements.major === v2Elements.major && v1Elements.minor > v2Elements.minor)
    ) {
        return SemverComparisonResult.V1GreaterThanV2;
    }
    if (
        v1Elements.major < v2Elements.major ||
        (v1Elements.major === v2Elements.major && v1Elements.minor < v2Elements.minor)
    ) {
        return SemverComparisonResult.V1LessThanV2;
    }

    if (v1Elements.patch && !v2Elements.patch) {
        return SemverComparisonResult.V1GreaterThanV2;
    }
    if (v2Elements.patch && !v1Elements.patch) {
        return SemverComparisonResult.V1LessThanV2;
    }

    if (v1Elements.patch > v2Elements.patch) {
        return SemverComparisonResult.V1GreaterThanV2;
    }
    if (v1Elements.patch < v2Elements.patch) {
        return SemverComparisonResult.V1LessThanV2;
    }
    return SemverComparisonResult.V1EqualToV2;
}

function splitSemVer(semver: string): SemVerElements {
    const radix = 10;
    const elements: string[] = semver.split('.');
    const major: number = parseInt(elements[0], radix);
    const minor: number = parseInt(elements[1], radix);

    const semVerElements: SemVerElements = {
        major,
        minor,
    };

    if (elements.length > 2) {
        semVerElements.patch = parseInt(elements[2], radix);
    }

    return semVerElements;
}
