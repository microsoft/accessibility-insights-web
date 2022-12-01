// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AccessibleNamesAdHocVisualization } from 'ad-hoc-visualizations/accessible-names/visualization';
import { ColorAdHocVisualization } from 'ad-hoc-visualizations/color/visualization';
import { HeadingsAdHocVisualization } from 'ad-hoc-visualizations/headings/visualization';
import { IssuesAdHocVisualization } from 'ad-hoc-visualizations/issues/visualization';
import { LandmarksAdHocVisualization } from 'ad-hoc-visualizations/landmarks/visualization';
import { NeedsReviewAdHocVisualization } from 'ad-hoc-visualizations/needs-review/visualization';
import { TabStopsAdHocVisualization } from 'ad-hoc-visualizations/tab-stops/visualization';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { find, forOwn, values } from 'lodash';
import { DictionaryNumberTo, DictionaryStringTo } from '../../types/common-types';
import { VisualizationType } from '../types/visualization-type';
import { TestMode } from './test-mode';
import { VisualizationConfiguration } from './visualization-configuration';
import {
    ForEachConfigCallback,
    VisualizationConfigurationFactory,
} from './visualization-configuration-factory';

export class WebVisualizationConfigurationFactory implements VisualizationConfigurationFactory {
    private configurationByType: DictionaryNumberTo<VisualizationConfiguration>;

    constructor(
        private readonly fullAssessmentProvider: AssessmentsProvider,
        private readonly mediumPassProvider?: AssessmentsProvider,
    ) {
        this.configurationByType = {
            [VisualizationType.Color]: ColorAdHocVisualization,
            [VisualizationType.Headings]: HeadingsAdHocVisualization,
            [VisualizationType.Issues]: IssuesAdHocVisualization,
            [VisualizationType.Landmarks]: LandmarksAdHocVisualization,
            [VisualizationType.TabStops]: TabStopsAdHocVisualization,
            [VisualizationType.NeedsReview]: NeedsReviewAdHocVisualization,
            [VisualizationType.AccessibleNames]: AccessibleNamesAdHocVisualization,
        };
    }

    public getConfigurationByKey(key: string): VisualizationConfiguration {
        return find(values(this.configurationByType), config => config.key === key);
    }

    public getConfiguration(visualizationType: VisualizationType): VisualizationConfiguration {
        if (this.mediumPassProvider?.isValidType(visualizationType)) {
            const assessment = this.mediumPassProvider.forType(visualizationType);
            return this.buildAssessmentConfiguration(assessment, TestMode.MediumPass);
        }

        if (this.fullAssessmentProvider.isValidType(visualizationType)) {
            const assessment = this.fullAssessmentProvider.forType(visualizationType);
            return this.buildAssessmentConfiguration(assessment, TestMode.Assessments);
        }

        const configuration = this.configurationByType[visualizationType];

        if (configuration == null) {
            throw new Error(`Unsupported type: ${visualizationType}`);
        }

        return configuration;
    }

    public forEachConfig(callback: ForEachConfigCallback): void {
        Object.keys(this.configurationByType).forEach(type => {
            callback(this.configurationByType[type], Number(type));
        });

        this.fullAssessmentProvider.all().forEach(assessment => {
            const testConfig = this.buildAssessmentConfiguration(assessment, TestMode.Assessments);

            assessment.requirements.forEach(requirementConfig => {
                callback(testConfig, assessment.visualizationType, requirementConfig);
            });
        });

        this.mediumPassProvider?.all().forEach(assessment => {
            const testConfig = this.buildAssessmentConfiguration(assessment, TestMode.MediumPass);

            assessment.requirements.forEach(requirementConfig => {
                callback(testConfig, assessment.visualizationType, requirementConfig);
            });
        });
    }

    private buildAssessmentConfiguration(
        assessment: Assessment,
        testMode: TestMode,
    ): VisualizationConfiguration {
        const config = assessment.getVisualizationConfiguration();

        const getIdentifier = (requirementKey: string) => {
            const requirement = assessment.requirements.find(req => req.key === requirementKey);
            return `${testMode}-${requirement.key}`;
        };

        const defaults = {
            testMode,
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
            getIdentifier,
        };

        return { ...config, ...defaults };
    }

    public getChromeCommandToVisualizationTypeMap(): DictionaryStringTo<VisualizationType> {
        const map: DictionaryStringTo<VisualizationType> = {};

        forOwn(this.configurationByType, (config, type) => {
            if (config.chromeCommand == null) {
                return;
            }

            map[config.chromeCommand] = Number(type);
        });

        return map;
    }
}
