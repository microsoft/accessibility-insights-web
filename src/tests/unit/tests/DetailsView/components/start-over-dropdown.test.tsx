// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { ContextualMenu } from 'office-ui-fabric-react';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { DetailsRightPanelConfiguration } from '../../../../../DetailsView/components/details-view-right-panel';
import { GenericDialog } from '../../../../../DetailsView/components/generic-dialog';
import {
    StartOverDropdown,
    StartOverProps,
} from '../../../../../DetailsView/components/start-over-dropdown';

describe('StartOverDropdownTest', () => {
    let defaultProps: StartOverProps;
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;

    const event = {
        currentTarget: 'test target',
    } as React.MouseEvent<any>;

    beforeEach(() => {
        detailsViewActionMessageCreatorMock = Mock.ofType<DetailsViewActionMessageCreator>();
        defaultProps = {
            deps: {
                detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
            },
            testName: 'test name',
            test: -1 as VisualizationType,
            requirementKey: 'test key',
            rightPanelConfiguration: {
                GetStartOverContextualMenuItemKeys: () => ['assessment', 'test'],
            } as DetailsRightPanelConfiguration,
            dropdownDirection: 'down',
        };
    });

    it('render', () => {
        const rendered = shallow(<StartOverDropdown {...defaultProps} />);

        expect(rendered.debug()).toMatchSnapshot();
    });

    it('render ContextualMenu', () => {
        const rendered = shallow<StartOverDropdown>(<StartOverDropdown {...defaultProps} />);
        rendered.find(InsightsCommandButton).simulate('click', event);
        expect(rendered.getElement()).toMatchSnapshot();
        expect(rendered.state().target).toBe(event.currentTarget);
    });

    it('render ContextualMenu with only one option', () => {
        defaultProps.rightPanelConfiguration = {
            GetStartOverContextualMenuItemKeys: () => ['assessment'],
        } as DetailsRightPanelConfiguration;
        const rendered = shallow<StartOverDropdown>(<StartOverDropdown {...defaultProps} />);
        rendered.find(InsightsCommandButton).simulate('click', event);
        expect(rendered.getElement()).toMatchSnapshot();
        expect(rendered.state().target).toBe(event.currentTarget);
    });

    it('render GenericDialog for start over a test', () => {
        const rendered = shallow(<StartOverDropdown {...defaultProps} />);
        rendered.find(InsightsCommandButton).simulate('click', event);
        rendered
            .find(ContextualMenu)
            .prop('items')
            .find(elem => elem.key === 'test')
            .onClick();
        expect(rendered.debug()).toMatchSnapshot();
    });

    it('render GenericDialog for start over the whole assessment', () => {
        const rendered = shallow(<StartOverDropdown {...defaultProps} />);
        rendered.find(InsightsCommandButton).simulate('click', event);
        rendered
            .find(ContextualMenu)
            .prop('items')
            .find(elem => elem.key === 'assessment')
            .onClick();
        expect(rendered.debug()).toMatchSnapshot();
    });

    it('render with dropdown on left', () => {
        const props: StartOverProps = {
            ...defaultProps,
            dropdownDirection: 'left',
        };
        const rendered = shallow(<StartOverDropdown {...props} />);
        rendered.find(InsightsCommandButton).simulate('click', event);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('should dismiss the start test over dialog', () => {
        detailsViewActionMessageCreatorMock
            .setup(creator =>
                creator.cancelStartOver(event, defaultProps.test, defaultProps.requirementKey),
            )
            .verifiable(Times.once());

        const rendered = shallow<StartOverDropdown>(<StartOverDropdown {...defaultProps} />);
        rendered.find(InsightsCommandButton).simulate('click', event);
        rendered
            .find(ContextualMenu)
            .prop('items')
            .find(elem => elem.key === 'test')
            .onClick();
        rendered.find(GenericDialog).prop('onCancelButtonClick')(event);

        expect(rendered.state().dialogState).toEqual('none');
        detailsViewActionMessageCreatorMock.verifyAll();
    });

    it('should dismiss the start assessment over dialog', () => {
        detailsViewActionMessageCreatorMock
            .setup(creator => creator.cancelStartOverAllAssessments(event))
            .verifiable(Times.once());

        const rendered = shallow<StartOverDropdown>(<StartOverDropdown {...defaultProps} />);
        rendered.find(InsightsCommandButton).simulate('click', event);
        rendered
            .find(ContextualMenu)
            .prop('items')
            .find(elem => elem.key === 'assessment')
            .onClick();
        rendered.find(GenericDialog).prop('onCancelButtonClick')(event);

        expect(rendered.state().dialogState).toEqual('none');
        detailsViewActionMessageCreatorMock.verifyAll();
    });

    it('should start over a test', () => {
        detailsViewActionMessageCreatorMock
            .setup(creator => creator.startOverTest(event, defaultProps.test))
            .verifiable(Times.once());

        const rendered = shallow<StartOverDropdown>(<StartOverDropdown {...defaultProps} />);
        rendered.find(InsightsCommandButton).simulate('click', event);
        rendered
            .find(ContextualMenu)
            .prop('items')
            .find(elem => elem.key === 'test')
            .onClick();
        rendered.find(GenericDialog).prop('onPrimaryButtonClick')(event);

        expect(rendered.state().dialogState).toEqual('none');
        detailsViewActionMessageCreatorMock.verifyAll();
    });

    it('should start over the whole assessment', () => {
        detailsViewActionMessageCreatorMock
            .setup(creator => creator.startOverAllAssessments(event))
            .verifiable(Times.once());

        const rendered = shallow<StartOverDropdown>(<StartOverDropdown {...defaultProps} />);
        rendered.find(InsightsCommandButton).simulate('click', event);
        rendered
            .find(ContextualMenu)
            .prop('items')
            .find(elem => elem.key === 'assessment')
            .onClick();
        rendered.find(GenericDialog).prop('onPrimaryButtonClick')(event);

        expect(rendered.state().dialogState).toEqual('none');
        detailsViewActionMessageCreatorMock.verifyAll();
    });

    it('should dismiss the contextMenu', () => {
        const rendered = shallow<StartOverDropdown>(<StartOverDropdown {...defaultProps} />);
        rendered.find(InsightsCommandButton).simulate('click', event);
        rendered.find(ContextualMenu).prop('onDismiss')();

        expect(rendered.state().isContextMenuVisible).toBe(false);
        expect(rendered.state().target).toBeNull();
    });
});
