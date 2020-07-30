// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { ContextualMenu } from 'office-ui-fabric-react';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { DialogStateSetter } from 'DetailsView/components/start-over-dialog';
import { DetailsRightPanelConfiguration } from '../../../../../DetailsView/components/details-view-right-panel';
import {
    StartOverDropdown,
    StartOverProps,
} from '../../../../../DetailsView/components/start-over-dropdown';

describe('StartOverDropdownTest', () => {
    let defaultProps: StartOverProps;
    let setDialogStateMock: IMock<DialogStateSetter>;

    const event = {
        currentTarget: 'test target',
    } as React.MouseEvent<any>;

    beforeEach(() => {
        setDialogStateMock = Mock.ofInstance(() => null);
        defaultProps = {
            testName: 'test name',
            rightPanelConfiguration: {
                GetStartOverContextualMenuItemKeys: () => ['assessment', 'test'],
            } as DetailsRightPanelConfiguration,
            dropdownDirection: 'down',
            setDialogState: setDialogStateMock.object,
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

    it('render with dropdown on left', () => {
        const props: StartOverProps = {
            ...defaultProps,
            dropdownDirection: 'left',
        };
        const rendered = shallow(<StartOverDropdown {...props} />);
        rendered.find(InsightsCommandButton).simulate('click', event);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('should open the start test over dialog', () => {
        setDialogStateMock.setup(sds => sds('test')).verifiable(Times.once());

        const rendered = shallow<StartOverDropdown>(<StartOverDropdown {...defaultProps} />);
        rendered.find(InsightsCommandButton).simulate('click', event);
        rendered
            .find(ContextualMenu)
            .prop('items')
            .find(elem => elem.key === 'test')
            .onClick();

        setDialogStateMock.verifyAll();
    });

    it('should open the start assessment over dialog', () => {
        setDialogStateMock.setup(sds => sds('assessment')).verifiable(Times.once());

        const rendered = shallow<StartOverDropdown>(<StartOverDropdown {...defaultProps} />);
        rendered.find(InsightsCommandButton).simulate('click', event);
        rendered
            .find(ContextualMenu)
            .prop('items')
            .find(elem => elem.key === 'assessment')
            .onClick();

        setDialogStateMock.verifyAll();
    });

    it('should dismiss the contextMenu', () => {
        const rendered = shallow<StartOverDropdown>(<StartOverDropdown {...defaultProps} />);
        rendered.find(InsightsCommandButton).simulate('click', event);
        rendered.find(ContextualMenu).prop('onDismiss')();

        expect(rendered.state().isContextMenuVisible).toBe(false);
        expect(rendered.state().target).toBeNull();
    });
});
