// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationConfigurationFactory } from '../../common/configs/visualization-configuration-factory';
import * as _ from 'lodash/index';

import { EnumHelper } from '../../common/enum-helper';
import { VisualizationType } from '../../common/types/visualization-type';

export const ShortcutCommandsTestData: chrome.commands.Command[] = [
    { description: 'Activate the extension', name: '_execute_browser_action', shortcut: 'Ctrl+Shift+K' },
    { description: 'Toggle Automated checks', name: '01_toggle-issues', shortcut: 'Ctrl+Shift+1' },
    { description: 'Toggle Landmarks', name: '02_toggle-landmarks', shortcut: 'Ctrl+Shift+2' },
    { description: 'Toggle Headings', name: '03_toggle-headings', shortcut: 'Ctrl+Shift+3' },
    { description: 'Toggle Tab stops', name: '04_toggle-tabStops', shortcut: '' },
    { description: 'Toggle Color', name: '05_toggle-color', shortcut: '' },

];

export function getVisualizationTypeToShortcutMapTestData(): IDictionaryNumberTo<string> {
    const map: IDictionaryNumberTo<string> = {};

    const types = EnumHelper.getNumericValues<VisualizationType>(VisualizationType);
    const configurationFactory = new VisualizationConfigurationFactory();

    _.each(types, type => {
        const configuration = configurationFactory.getConfiguration(type);
        const shortcutData = _.find(ShortcutCommandsTestData, command => command.name === configuration.chromeCommand);
        map[type] = shortcutData ? shortcutData.shortcut : '';
    });

    return map;
}
