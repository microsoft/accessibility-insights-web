// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    CommandBarButtonsMenu,
    CommandBarButtonsMenuProps,
} from 'DetailsView/components/command-bar-buttons-menu';
import { DropdownDirection } from 'DetailsView/components/start-over-dropdown';
import { shallow } from 'enzyme';
import { IButton, IOverflowSetItemProps, RefObject } from 'office-ui-fabric-react';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

describe('CommandBarButtonsMenu', () => {
    let renderExportReportComponentMock: IMock<() => JSX.Element>;
    let renderStartOverComponentMock: IMock<(dropdownDirection: DropdownDirection) => JSX.Element>;
    let commandBarButtonsMenuProps: CommandBarButtonsMenuProps;

    beforeEach(() => {
        renderExportReportComponentMock = Mock.ofInstance(() => null);
        renderStartOverComponentMock = Mock.ofType<
            (dropdownDirection: DropdownDirection) => JSX.Element
        >();
        commandBarButtonsMenuProps = {
            renderExportReportButton: renderExportReportComponentMock.object,
            renderStartOverButton: renderStartOverComponentMock.object,
            buttonRef: {} as RefObject<IButton>,
        } as CommandBarButtonsMenuProps;
    });

    it('renders CommandBarButtonsMenu', () => {
        const wrapper = shallow(<CommandBarButtonsMenu {...commandBarButtonsMenuProps} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders child buttons', () => {
        renderExportReportComponentMock
            .setup(r => r())
            .returns(() => <>Report export button</>)
            .verifiable(Times.once());

        renderStartOverComponentMock
            .setup(s => s('left'))
            .returns(() => <>Start over button</>)
            .verifiable(Times.once());

        const wrapper = shallow(<CommandBarButtonsMenu {...commandBarButtonsMenuProps} />);
        const renderedProps = wrapper.getElement().props;
        const overflowItems: IOverflowSetItemProps[] = renderedProps.menuProps?.items;
        expect(overflowItems).toBeDefined();
        expect(overflowItems).toHaveLength(2);

        overflowItems.forEach(item => expect(item.onRender()).toMatchSnapshot());

        renderExportReportComponentMock.verifyAll();
        renderStartOverComponentMock.verifyAll();
    });
});
