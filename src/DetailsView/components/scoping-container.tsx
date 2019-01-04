// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { ScopingInputTypes } from '../../background/scoping-input-types';
import { InspectMode } from '../../background/inspect-modes';
import { SelectorInputList } from '../../common/components/selector-input-list';
import { InspectActionMessageCreator } from '../../common/message-creators/inspect-action-message-creator';
import { ScopingActionMessageCreator } from '../../common/message-creators/scoping-action-message-creator';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { IScopingStoreData } from '../../common/types/store-data/scoping-store-data';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';

export interface IScopingContainerProps {
    actionMessageCreator: DetailsViewActionMessageCreator;
    featureFlagData: FeatureFlagStoreData;
    scopingSelectorsData: IScopingStoreData;
    scopingActionMessageCreator: ScopingActionMessageCreator;
    inspectActionMessageCreator: InspectActionMessageCreator;
}

export class ScopingContainer extends React.Component<IScopingContainerProps> {
    public static readonly renderInstructions =
             <div>
                <p>Run tests on specific portions of your code by indicating specific selectors.</p>
                <p>To add a Selector, type the Selector’s name in the appropriate text box and click the “+ Add Selector” button.</p>
                <p>Note: iframe Selectors need to be entered in the following format: iframeSelector; selectorWithinIframe</p>
                <p>Any selectors entered need to follow CSS selector syntax. For example, a selector needs to be prefaced with a <b>#</b> if
                    it represents an id (e.g. <i>#idName</i>) and with a <b>.</b> if it represents a class (e.g. <i>.className</i> or <i>.class1.class2</i> for elements with two classes)</p>
            </div> ;

    public static readonly includeInstructions =
        <div>
            <p>The selectors entered in this textbox will be the only elements that will be scanned; if <i>Include</i> is left empty, by default the entire document will be scanned.</p>
        </div>;

    public static readonly excludeInstructions =
        <div>
            <p>The selectors entered in this textbox will be excluded from the scan.
                If <i>Exclude</i> is empty, the scan will show the elements in <i>Include</i>.
                If <i>Exclude</i> is not empty, the scan will show elements in <i>Include</i> that are not listed in <i>Exclude</i>;
                if <i>Include</i> is empty, the scan will show elements in the entire document that are not listed in <i>Exclude</i>.
            </p>
        </div>;

    public render(): JSX.Element {
        return (
            <div className="scoping-container">
                <div className="scoping-description">{ScopingContainer.renderInstructions}</div>
                <SelectorInputList
                    title = {'Include'}
                    subtitle = {'Insert selectors you want included in your scan'}
                    items={this.props.scopingSelectorsData.selectors[ScopingInputTypes.include]}
                    instructions={ScopingContainer.includeInstructions}
                    inputType={ScopingInputTypes.include}
                    inspectMode={InspectMode.scopingAddInclude}
                    onAddSelector={this.props.scopingActionMessageCreator.addSelector}
                    onDeleteSelector={this.props.scopingActionMessageCreator.deleteSelector}
                    onChangeInspectMode={this.props.inspectActionMessageCreator.changeInspectMode}
                />
                <SelectorInputList
                    title = {'Exclude'}
                    subtitle = {'Insert selectors you want excluded from your scan'}
                    items={this.props.scopingSelectorsData.selectors[ScopingInputTypes.exclude]}
                    inputType={ScopingInputTypes.exclude}
                    inspectMode={InspectMode.scopingAddExclude}
                    instructions={ScopingContainer.excludeInstructions}
                    onAddSelector={this.props.scopingActionMessageCreator.addSelector}
                    onDeleteSelector={this.props.scopingActionMessageCreator.deleteSelector}
                    onChangeInspectMode={this.props.inspectActionMessageCreator.changeInspectMode}
                />
            </div>
        );
    }
}
