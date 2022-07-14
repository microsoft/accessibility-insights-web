// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SelectorInputList } from 'common/components/selector-input-list';
import { InspectActionMessageCreator } from 'common/message-creators/inspect-action-message-creator';
import { ScopingActionMessageCreator } from 'common/message-creators/scoping-action-message-creator';
import { ScopingInputTypes } from 'common/types/store-data/scoping-input-types';
import { ScopingStoreData } from 'common/types/store-data/scoping-store-data';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    ScopingContainer,
    ScopingContainerProps,
} from 'DetailsView/components/details-view-overlay/scoping-panel/scoping-container';
import styles from 'DetailsView/components/details-view-overlay/scoping-panel/scoping-container.scss';
import * as Enzyme from 'enzyme';
import * as React from 'react';
import { Mock } from 'typemoq';

describe('ScopingContainerTest', () => {
    const scopingSelectorsStub: ScopingStoreData = {
        selectors: {
            [ScopingInputTypes.include]: [['include selector 0'], ['include selector 1']],
            [ScopingInputTypes.exclude]: [['exclude selector 0'], ['exclude selector 1']],
        },
    };

    test('constructor', () => {
        const testSubject = new ScopingContainer({} as ScopingContainerProps);

        expect(testSubject).toBeDefined();
    });

    test('render', () => {
        const detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        const scopingActionMessageCreatorMock = Mock.ofType(ScopingActionMessageCreator);
        const inspectActionMessageCreatorMock = Mock.ofType(InspectActionMessageCreator);
        const featureFlagStoreDataStub = {};
        const props: ScopingContainerProps = {
            deps: {
                detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
            },
            featureFlagData: featureFlagStoreDataStub,
            scopingSelectorsData: scopingSelectorsStub,
            scopingActionMessageCreator: scopingActionMessageCreatorMock.object,
            inspectActionMessageCreator: inspectActionMessageCreatorMock.object,
        };

        const wrapper = Enzyme.shallow(<ScopingContainer {...props} />);

        const description = wrapper.find('.' + styles.scopingDescription);
        expect(description.exists()).toBe(true);
        expect(description.contains(ScopingContainer.renderInstructions)).toBe(true);

        const selectorLists = wrapper.find(SelectorInputList);
        expect(selectorLists.length).toBe(2);

        const includeList = selectorLists.first();
        const excludeList = selectorLists.last();
        selectorAsserts(
            includeList,
            'Include',
            'Insert selectors you want included in your scan',
            scopingSelectorsStub.selectors[ScopingInputTypes.include],
            ScopingContainer.includeInstructions,
            'include',
            scopingActionMessageCreatorMock.object,
            inspectActionMessageCreatorMock.object,
        );
        selectorAsserts(
            excludeList,
            'Exclude',
            'Insert selectors you want excluded from your scan',
            scopingSelectorsStub.selectors[ScopingInputTypes.exclude],
            ScopingContainer.excludeInstructions,
            'exclude',
            scopingActionMessageCreatorMock.object,
            inspectActionMessageCreatorMock.object,
        );
    });

    function selectorAsserts(
        list: Enzyme.ShallowWrapper<any, any>,
        title: string,
        subtitle: string,
        selectors: string[][],
        instructions: JSX.Element,
        inputType: string,
        scopingActionMessageCreator: ScopingActionMessageCreator,
        inspectActionMessageCreator: InspectActionMessageCreator,
    ): void {
        expect(list.prop('title')).toEqual(title);
        expect(list.prop('subtitle')).toEqual(subtitle);
        expect(list.prop('items')).toEqual(selectors);
        expect(list.prop('instructions')).toEqual(instructions);
        expect(list.prop('inputType')).toEqual(inputType);
        expect(list.prop('onAddSelector')).toEqual(scopingActionMessageCreator.addSelector);
        expect(list.prop('onDeleteSelector')).toEqual(scopingActionMessageCreator.deleteSelector);
        expect(list.prop('onChangeInspectMode')).toEqual(
            inspectActionMessageCreator.changeInspectMode,
        );
    }
});
