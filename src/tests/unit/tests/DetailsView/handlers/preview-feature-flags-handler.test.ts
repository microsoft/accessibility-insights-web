// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    FeatureFlagDetail,
    FeatureFlags,
} from '../../../../../common/feature-flags';
import { FeatureFlagStoreData } from '../../../../../common/types/store-data/feature-flag-store-data';
import { PreviewFeatureFlagsHandler } from '../../../../../DetailsView/handlers/preview-feature-flags-handler';

describe('PreviewFeatureFlagHandlerTest', () => {
    test('empty data not a problem', () => {
        const testObject = new PreviewFeatureFlagsHandler([]);

        const actual = testObject.getDisplayableFeatureFlags({});

        const expected = [];
        expect(actual).toEqual(expected);
    });

    test('hidden flags filtered out when showAll is false', () => {
        const details = getTestFlagDetails();
        const testObject = new PreviewFeatureFlagsHandler(details);

        const flags = getTestFlagValues(false);
        const actual = testObject.getDisplayableFeatureFlags(flags);

        expect(actual).toHaveLength(2);
        expect(actual[0].id).toBe('trueFlag');
        expect(actual[1].id).toBe('falseFlag');
    });

    test('all flags are returned when showAll is true, and details are copied over', () => {
        const details = getTestFlagDetails();
        const testObject = new PreviewFeatureFlagsHandler(details);

        const flags = getTestFlagValues(true);
        const actual = testObject.getDisplayableFeatureFlags(flags);

        expect(actual).toHaveLength(5);
        for (let i: number = 0; i < actual.length; i++) {
            expect(actual[i].id).toEqual(details[i].id);
            expect(actual[i].displayableName).toEqual(
                details[i].displayableName,
            );
            expect(actual[i].displayableDescription).toEqual(
                details[i].displayableDescription,
            );
        }
    });

    test('flags enabled state is copied over from store data', () => {
        const details = getTestFlagDetails();
        const testObject = new PreviewFeatureFlagsHandler(details);

        const flags = getTestFlagValues(true);
        const actual = testObject.getDisplayableFeatureFlags(flags);

        expect(actual).toHaveLength(5);

        expect(actual[0].enabled).toBeTruthy();
        expect(actual[1].enabled).toBeFalsy();
        expect(actual[2].enabled).toBeTruthy();
        expect(actual[3].enabled).toBeFalsy();
        expect(actual[4].enabled).toBeTruthy();
    });

    function getTestFlagValues(showAll: boolean): FeatureFlagStoreData {
        return {
            ['trueFlag']: true,
            ['falseFlag']: false,
            ['trueFlagHidden']: true,
            ['falseFlagHidden']: false,
            [FeatureFlags.showAllFeatureFlags]: showAll,
        };
    }

    function getTestFlagDetails(): FeatureFlagDetail[] {
        return [
            {
                id: 'trueFlag',
                defaultValue: false,
                displayableName: 'trueFlag name',
                displayableDescription: 'trueFlag description',
                isPreviewFeature: true,
                forceDefault: false,
            },
            {
                id: 'falseFlag',
                defaultValue: false,
                displayableName: 'falseFlag name',
                displayableDescription: 'falseFlag description',
                isPreviewFeature: true,
                forceDefault: false,
            },
            {
                id: 'trueFlagHidden',
                defaultValue: false,
                displayableName: 'trueFlagHidden name',
                displayableDescription: 'trueFlagHidden description',
                isPreviewFeature: false,
                forceDefault: false,
            },
            {
                id: 'falseFlagHidden',
                defaultValue: false,
                displayableName: 'falseFlagHidden name',
                displayableDescription: 'falseFlagHidden description',
                isPreviewFeature: false,
                forceDefault: false,
            },
            {
                id: FeatureFlags.showAllFeatureFlags,
                defaultValue: false,
                displayableName: 'showAllFeatureFlags name',
                displayableDescription: 'showAllFeatureFlags description',
                isPreviewFeature: false,
                forceDefault: false,
            },
        ];
    }
});
