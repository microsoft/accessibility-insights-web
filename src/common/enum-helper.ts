// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export interface NumericEnum {
    [id: number]: string;
}

export class EnumHelper {
    public static getNumericValues<T>(enumType: NumericEnum): T[] {
        const result: T[] = [];
        let foundNumericKey = false;

        for (const type in enumType) {
            if (!isNaN(Number(type))) {
                foundNumericKey = true;
                const rightHandValue = enumType[type];
                const properType = enumType[rightHandValue];
                result.push(properType);
            }
        }

        if (!foundNumericKey) {
            throw new Error(`No 'number' key found on ${enumType}`);
        }

        return result;
    }
}
