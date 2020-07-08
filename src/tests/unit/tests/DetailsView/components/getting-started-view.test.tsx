// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Requirement } from 'assessments/types/requirement';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    GettingStartedView,
    GettingStartedViewDeps,
    GettingStartedViewProps,
} from 'DetailsView/components/getting-started-view';
import { shallow } from 'enzyme';
import { DefaultButton } from 'office-ui-fabric-react';
import * as React from 'react';
import { Mock } from 'typemoq';
import { ContentPageComponent } from 'views/content/content-page';

describe('GettingStartedViewTest', () => {
    it('renders with content from props', () => {
        const messageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        const eventStub = {} as React.MouseEvent<HTMLElement>;
        const props: GettingStartedViewProps = {
            deps: {
                detailsViewActionMessageCreator: messageCreatorMock.object,
            } as GettingStartedViewDeps,
            gettingStartedContent: <div>test-getting-started-content</div>,
            title: 'some title',
            guidance: { pageTitle: 'some page title' } as ContentPageComponent,
            nextRequirement: {
                key: 'some requirement key',
            } as Requirement,
            currentTest: -1,
        };

        messageCreatorMock
            .setup(mock =>
                mock.selectRequirement(eventStub, props.nextRequirement.key, props.currentTest),
            )
            .verifiable();

        const rendered = shallow(<GettingStartedView {...props} />);
        rendered.find(DefaultButton).prop('onClick')(eventStub);

        expect(rendered.getElement()).toMatchSnapshot();
        messageCreatorMock.verifyAll();
    });
});
