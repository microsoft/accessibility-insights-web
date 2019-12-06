// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';
import { DropdownClickHandler } from '../../../../../common/dropdown-click-handler';
import { DetailsViewPivotType } from '../../../../../common/types/details-view-pivot-type';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { TabInfo, TabInfoProps } from '../../../../../DetailsView/components/tab-info';

describe('TabInfo', () => {
    const scenarios = [
        {
            name: 'internal edition',
            showCoverageMessageBar: true,
        },
    ];

    scenarios.forEach(scenario => {
        describe(scenario.name, () => {
            let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
            let dropdownClickHandlerMock: IMock<DropdownClickHandler>;
            let testProps: TabInfoProps;

            beforeEach(() => {
                detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
                dropdownClickHandlerMock = Mock.ofType(DropdownClickHandler);

                testProps = {
                    deps: {
                        detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
                    },
                    title: 'test title',
                    url: 'test url',
                    isTargetPageHidden: false,
                    selectedPivot: DetailsViewPivotType.fastPass,
                    dropdownClickHandler: dropdownClickHandlerMock.object,
                } as TabInfoProps;
            });

            test('render with warning messagebar', () => {
                testProps.isTargetPageHidden = true;
                const testSubject = shallow(<TabInfo {...testProps} />);

                expect(testSubject.debug()).toMatchSnapshot();
            });

            test('render without warning messagebar', () => {
                testProps.isTargetPageHidden = false;
                const testSubject = shallow(<TabInfo {...testProps} />);

                expect(testSubject.getElement()).toBeNull();
            });
        });
    });
});
