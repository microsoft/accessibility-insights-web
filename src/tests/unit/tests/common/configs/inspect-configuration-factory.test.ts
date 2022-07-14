// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InspectMode } from 'common/types/store-data/inspect-modes';
import { ScopingInputTypes } from 'common/types/store-data/scoping-input-types';
import { Mock, Times } from 'typemoq';
import {
    ConfigurationKey,
    InspectConfigurationFactory,
} from '../../../../../common/configs/inspect-configuration-factory';
import { ScopingActionMessageCreator } from '../../../../../common/message-creators/scoping-action-message-creator';
import { EventStubFactory } from '../../../common/event-stub-factory';

describe('InspectConfigurationTest', () => {
    const scopingActionMessageCreatorMock = Mock.ofType<ScopingActionMessageCreator>();
    const testObject = new InspectConfigurationFactory(scopingActionMessageCreatorMock.object);

    afterEach(() => {
        scopingActionMessageCreatorMock.reset();
    });

    test('get config for unsupported type', () => {
        const invalidType = 'random' as InspectMode;
        const action = () => {
            testObject.getConfigurationByKey(invalidType as ConfigurationKey);
        };

        expect(action).toThrowError(`Unsupported type: ${invalidType}`);
    });

    test('getConfigurationByKey for inspect configuration', () => {
        const keys = Object.keys(InspectMode).filter(checkNonNullConfig) as ConfigurationKey[];

        keys.forEach(key => {
            const configuration = testObject.getConfigurationByKey(key);

            expect(configuration).toBeDefined();
        });
    });

    describe('add selector', () => {
        const event = new EventStubFactory().createKeypressEvent() as any;
        const testSelector = ['.test-selector'];

        it('handles include', () => {
            scopingActionMessageCreatorMock
                .setup(creator =>
                    creator.addSelector(event, ScopingInputTypes.include, testSelector),
                )
                .verifiable(Times.once());

            const handler = testObject.getConfigurationByKey(InspectMode.scopingAddInclude);
            handler(event, testSelector);

            scopingActionMessageCreatorMock.verifyAll();
        });

        it('handles exclude', () => {
            scopingActionMessageCreatorMock
                .setup(creator =>
                    creator.addSelector(event, ScopingInputTypes.exclude, testSelector),
                )
                .verifiable(Times.once());

            const handler = testObject.getConfigurationByKey(InspectMode.scopingAddExclude);
            handler(event, testSelector);

            scopingActionMessageCreatorMock.verifyAll();
        });
    });

    function checkNonNullConfig(key: string): boolean {
        return key.valueOf() !== InspectMode.off.valueOf();
    }
});
