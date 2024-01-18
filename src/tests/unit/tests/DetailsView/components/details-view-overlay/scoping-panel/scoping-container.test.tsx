// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
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
import * as React from 'react';
import { Mock } from 'typemoq';
import {
    getMockComponentClassPropsForCall,
    mockReactComponents,
} from '../../../../../mock-helpers/mock-module-helpers';

jest.mock('common/components/selector-input-list');
describe('ScopingContainerTest', () => {
    mockReactComponents([SelectorInputList]);
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

        const renderResult = render(<ScopingContainer {...props} />);

        const description = renderResult.container.querySelector('.' + styles.scopingDescription);

        expect(description).not.toBeNull();
        expect(description).toMatchSnapshot();

        const mockCalls =
            (SelectorInputList as any).mock?.calls || (SelectorInputList as any).render.mock.calls;
        expect(mockCalls.length).toBe(2);

        const includeList = getMockComponentClassPropsForCall(SelectorInputList);
        const excludeList = getMockComponentClassPropsForCall(SelectorInputList, 2);
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
        list: any,
        title: string,
        subtitle: string,
        selectors: string[][],
        instructions: JSX.Element,
        inputType: string,
        scopingActionMessageCreator: ScopingActionMessageCreator,
        inspectActionMessageCreator: InspectActionMessageCreator,
    ): void {
        expect(list.title).toEqual(title);
        expect(list.subtitle).toEqual(subtitle);
        expect(list.items).toEqual(selectors);
        expect(list.instructions).toEqual(instructions);
        expect(list.inputType).toEqual(inputType);
        expect(list.onAddSelector).toEqual(scopingActionMessageCreator.addSelector);
        expect(list.onDeleteSelector).toEqual(scopingActionMessageCreator.deleteSelector);
        expect(list.onChangeInspectMode).toEqual(inspectActionMessageCreator.changeInspectMode);
    }
});
