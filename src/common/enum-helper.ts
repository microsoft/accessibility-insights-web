// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export interface NumericEnum {
    [id: number]: string;
}

export class EnumHelper {
    public static getNumericValues<T>(enumType: NumericEnum): T[] {
        const result: T[] = [];
        let foundNumericKey = false;

        for (const currentType in enumType) {
            if (!isNaN(Number(currentType))) {
                foundNumericKey = true;
                const rightHandValue = enumType[currentType];
                const properType = enumType[rightHandValue];
                result.push(properType);
            }
        }

        if (!foundNumericKey) {
            throw new Error(`No 'number' key found on ${JSON.stringify(enumType)}`);
        }

        return result;
    }
}
