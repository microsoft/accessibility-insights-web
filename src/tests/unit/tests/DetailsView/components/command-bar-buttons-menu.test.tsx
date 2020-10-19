// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    CommandBarButtonsMenu,
    CommandBarButtonsMenuProps,
} from 'DetailsView/components/command-bar-buttons-menu';
import { StartOverMenuItem } from 'DetailsView/components/start-over-component-factory';
import { shallow } from 'enzyme';
import { IButton, IOverflowSetItemProps, RefObject } from 'office-ui-fabric-react';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

describe('CommandBarButtonsMenu', () => {
    let renderExportReportComponentMock: IMock<() => JSX.Element>;
    let renderSaveAssessmentButtonMock: IMock<() => JSX.Element>;
    let getStartOverMenuItemMock: IMock<() => StartOverMenuItem>;
    let commandBarButtonsMenuProps: CommandBarButtonsMenuProps;

    beforeEach(() => {
        renderExportReportComponentMock = Mock.ofInstance(() => null);
        renderSaveAssessmentButtonMock = Mock.ofInstance(() => null);
        getStartOverMenuItemMock = Mock.ofInstance(() => null);
        commandBarButtonsMenuProps = {
            renderExportReportButton: renderExportReportComponentMock.object,
            renderSaveAssessmentButton: renderSaveAssessmentButtonMock.object,
            getStartOverMenuItem: getStartOverMenuItemMock.object,
            buttonRef: {} as RefObject<IButton>,
        } as CommandBarButtonsMenuProps;
    });

    it('renders CommandBarButtonsMenu', () => {
        const wrapper = shallow(<CommandBarButtonsMenu {...commandBarButtonsMenuProps} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders child buttons', () => {
        setupExportReportMenuItem();
        setupSaveAssessmentMenuItem();
        setupStartOverMenuItem();

        const wrapper = shallow(<CommandBarButtonsMenu {...commandBarButtonsMenuProps} />);
        const renderedProps = wrapper.getElement().props;
        const overflowItems: IOverflowSetItemProps[] = renderedProps.menuProps?.items;
        expect(overflowItems).toBeDefined();
        expect(overflowItems).toHaveLength(3);

        expect(overflowItems[0].onRender()).toMatchSnapshot('render export report menuitem');
        expect(overflowItems[1].onRender()).toMatchSnapshot('render save assessment menuitem');
        expect(overflowItems[2].onRender()).toMatchSnapshot('render start over menuitem');

        renderExportReportComponentMock.verifyAll();
        renderSaveAssessmentButtonMock.verifyAll();
        getStartOverMenuItemMock.verifyAll();
    });

    it('renders child buttons with the exception of child behind feature flag', () => {
        setupExportReportMenuItem();
        setupSaveAssessmentMenuItem();
        setupStartOverMenuItem();
        const renderSaveAssessmentButtonMock = null;

        const wrapper = shallow(<CommandBarButtonsMenu {...commandBarButtonsMenuProps} />);
        const renderedProps = wrapper.getElement().props;
        const overflowItems: IOverflowSetItemProps[] = renderedProps.menuProps?.items;
        expect(overflowItems).toBeDefined();
        expect(overflowItems).toHaveLength(2);
        console.log(overflowItems[1].debug());

        expect(overflowItems[0].onRender()).toMatchSnapshot('render export report menuitem');
        expect(overflowItems[1].onRender()).toMatchSnapshot('render save assessment menuitem');
        expect(overflowItems[2].onRender()).toMatchSnapshot('render start over menuitem');

        renderExportReportComponentMock.verifyAll();
        renderSaveAssessmentButtonMock.verifyAll();
        getStartOverMenuItemMock.verifyAll();
    });

    function setupExportReportMenuItem(): void {
        renderExportReportComponentMock
            .setup(r => r())
            .returns(() => <>Report export button</>)
            .verifiable(Times.once());
    }

    function setupSaveAssessmentMenuItem(): void {
        renderSaveAssessmentButtonMock
            .setup(r => r())
            .returns(() => <>Save assessment button</>)
            .verifiable(Times.once());
    }

    function setupStartOverMenuItem(): void {
        const startOverMenuItem = {
            onRender: () => <>Start over button</>,
        };
        getStartOverMenuItemMock
            .setup(s => s())
            .returns(() => startOverMenuItem)
            .verifiable(Times.once());
    }
});
