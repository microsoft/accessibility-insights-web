// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ColorAdHocVisualization } from 'ad-hoc-visualizations/color/visualization';
import { HeadingsAdHocVisualization } from 'ad-hoc-visualizations/headings/visualization';
import { IssuesAdHocVisualization } from 'ad-hoc-visualizations/issues/visualization';
import { LandmarksAdHocVisualization } from 'ad-hoc-visualizations/landmarks/visualization';
import { NeedsReviewAdHocVisualization } from 'ad-hoc-visualizations/needs-review/visualization';
import { TabStopsAdHocVisualization } from 'ad-hoc-visualizations/tab-stops/visualization';
import { Assessments } from 'assessments/assessments';
import { each, find, values } from 'lodash';
import { DictionaryNumberTo, DictionaryStringTo } from '../../types/common-types';
import { EnumHelper } from '../enum-helper';
import { VisualizationType } from '../types/visualization-type';
import { TestMode } from './test-mode';
import { VisualizationConfiguration } from './visualization-configuration';
import { VisualizationConfigurationFactory } from './visualization-configuration-factory';

export class WebVisualizationConfigurationFactory implements VisualizationConfigurationFactory {
    private configurationByType: DictionaryNumberTo<VisualizationConfiguration>;

    constructor() {
        this.configurationByType = {
            [VisualizationType.Color]: ColorAdHocVisualization,
            [VisualizationType.Headings]: HeadingsAdHocVisualization,
            [VisualizationType.Issues]: IssuesAdHocVisualization,
            [VisualizationType.Landmarks]: LandmarksAdHocVisualization,
            [VisualizationType.TabStops]: TabStopsAdHocVisualization,
            [VisualizationType.NeedsReview]: NeedsReviewAdHocVisualization,
        };
    }

    public getConfigurationByKey(key: string): VisualizationConfiguration {
        return find(values(this.configurationByType), config => config.key === key);
    }

    public getConfiguration(visualizationType: VisualizationType): VisualizationConfiguration {
        if (Assessments.isValidType(visualizationType)) {
            const assessment = Assessments.forType(visualizationType);
            const defaults = {
                testMode: TestMode.Assessments,
                chromeCommand: null,
                launchPanelDisplayOrder: null,
                adhocToolsPanelDisplayOrder: null,
                displayableData: {
                    title: assessment.title,
                    noResultsFound: null,
                    enableMessage: null,
                    toggleLabel: null,
                    linkToDetailsViewText: null,
                },
                shouldShowExportReport: null,
            };
            const config = assessment.getVisualizationConfiguration();
            return { ...config, ...defaults };
        }

        const configuration = this.configurationByType[visualizationType];

        if (configuration == null) {
            throw new Error(`Unsupported type: ${visualizationType}`);
        }

        return configuration;
    }

    public getChromeCommandToVisualizationTypeMap(): DictionaryStringTo<VisualizationType> {
        const map: DictionaryStringTo<VisualizationType> = {};

        const types = EnumHelper.getNumericValues<VisualizationType>(VisualizationType);

        each(types, visualizationType => {
            const configuration = this.configurationByType[visualizationType];

            if (configuration && configuration.chromeCommand != null) {
                map[configuration.chromeCommand] = visualizationType;
            }
        });

        return map;
    }
}
