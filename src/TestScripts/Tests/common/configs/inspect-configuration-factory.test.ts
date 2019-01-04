// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Mock } from 'typemoq';

import { InspectMode } from '../../../../background/inspect-modes';
import { InspectConfigurationFactory } from '../../../../common/configs/inspect-configuration-factory';
import { ScopingActionMessageCreator } from '../../../../common/message-creators/scoping-action-message-creator';

describe('InspectConfigurationTest', () => {
    const scopingActionMessageCreatorMock = Mock.ofType(ScopingActionMessageCreator);
    const testObject = new InspectConfigurationFactory(scopingActionMessageCreatorMock.object);

    test('get config for unsupported type', () => {
        const invalidType = 'random' as InspectMode;
        const action = () => {
            testObject.getConfigurationByKey(invalidType);
        };

        expect(action).toThrowError(`Unsupported type: ${invalidType}`)
    });

    test('getConfigurationByKey for inspect configuration', () => {
        const keys = Object.keys(InspectMode).filter(checkNonNullConfig);

        keys.forEach(key => {
            const configuration = testObject.getConfigurationByKey(key);

            expect(configuration).toBeDefined();
        });
    });

    function checkNonNullConfig(key: string): boolean {
        return key.valueOf() !== InspectMode.off.valueOf();
    }
});
