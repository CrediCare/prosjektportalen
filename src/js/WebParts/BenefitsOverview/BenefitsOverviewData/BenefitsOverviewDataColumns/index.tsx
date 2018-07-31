import * as React from "react";
import __ from "../../../../Resources";
import { IColumn } from "office-ui-fabric-react/lib/DetailsList";
import { Icon } from "office-ui-fabric-react/lib/Icon";
import { ModalLink } from "../../../@Components";
import DataSource from "../../../DataSource";
import BenefitEntry from "../BenefitEntry";
import TrendIcon from "./TrendIcon";

const Columns = (): any[] => {
    return [{
        fieldName: "Title",
        key: "Title",
        name: __.getResource("Lists_BenefitsAnalysis_Fields_Title_DisplayName"),
        minWidth: 100,
        maxWidth: 180,
        isMultiline: true,
    },
    {
        fieldName: "Responsible",
        key: "GtGainsResponsible",
        minWidth: 50,
        maxWidth: 180,
    },
    {
        fieldName: "MeasureIndicator",
        key: "GtMeasureIndicator",
        minWidth: 50,
        maxWidth: 180,
        isMultiline: true,
    },
    {
        fieldName: "MeasurementUnit",
        key: "GtMeasurementUnit",
        minWidth: 50,
        maxWidth: 80,
    },
    {
        fieldName: "StartValue",
        key: "GtStartValue",
        minWidth: 50,
        maxWidth: 80,
    },
    {
        fieldName: "DesiredValue",
        key: "GtDesiredValue",
        minWidth: 50,
        maxWidth: 80,
    },
    {
        fieldName: "PreviousValue",
        key: "PreviousValue",
        name: __.getResource("BenefitsOverview_PreviousValue"),
        minWidth: 50,
        maxWidth: 80,
    },
    {
        fieldName: "PreviousPercentage",
        key: "PreviousPercentage",
        name: __.getResource("BenefitsOverview_PreviousPercentage"),
        minWidth: 50,
        maxWidth: 80,
    },
    {
        fieldName: "LatestValue",
        key: "LatestValue",
        name: __.getResource("BenefitsOverview_LatestValue"),
        minWidth: 50,
        maxWidth: 80,
    },
    {
        fieldName: "LatestPercentage",
        key: "LatestPercentage",
        name: __.getResource("BenefitsOverview_LatestPercentage"),
        minWidth: 50,
        maxWidth: 80,
    },
    {
        fieldName: "AllMeasurements",
        key: "AllMeasurements",
        name: "",
        minWidth: 50,
        maxWidth: 80,
    }].map(col => ({
        ...col,
        isResizable: true,
    }));
};

/**
 * Get column by key
 *
 * @param {string} key Key
 */
export const GetColumnByKey = (key: string): IColumn => {
    let find = Columns().filter(column => column.key === key);
    let [col] = find;
    return col;
};

/**
 * Generate columns based on data source and fields
 *
 * @param {Object} fieldNamesMap Field names map, maps InternalName => Title
 * @param {DataSource} dataSource Data source
 */
export const GenerateColumns = (fieldNamesMap: { [key: string]: string }, dataSource: DataSource): any[] => {
    let generatedColumns = Columns().map(col => (Object.assign(col, {
        name: col.hasOwnProperty("name") ? col.name : (fieldNamesMap[col.key] || col.key),
    })));
    switch (dataSource) {
        case DataSource.Search: {
            /* Adding Site Title for data souce Search */
            generatedColumns.unshift({
                fieldName: "SiteTitle",
                key: "SiteTitle",
                name: __.getResource("String_Project"),
                minWidth: 100,
                maxWidth: 180,
            });
        }
    }
    return generatedColumns;
};

/**
 * On render item column
 *
 * @param {BenefitEntry} item The item
 * @param {index} index The index
 * @param {IColumn} column The column
 * @param {Function} onSiteTitleClick On SiteTitle click event
 * @param {Function} showAllMeasurements On show all measurements
 */
const _onRenderItemColumn = (item: BenefitEntry, index: number, column: IColumn, onSiteTitleClick: (e) => void, showAllMeasurements: (entry: BenefitEntry) => void): any => {
    const colValue = item[column.fieldName];
    const { LatestValue, PreviousValue, LatestPercentage, ValueShouldIncrease } = item;

    switch (column.key) {
        case "Title": {
            return (
                <ModalLink
                    label={colValue}
                    url={item.DisplayFormUrl}
                    options={{ HideRibbon: true }} />
            );
        }
        case "SiteTitle": {
            let { SiteTitle: Title } = item;
            return (
                <a href={item.DisplayFormUrl} onClick={onSiteTitleClick}>{Title}</a>
            );
        }
        case "PreviousPercentage": {
            let { PreviousPercentage } = item;
            if (PreviousPercentage && PreviousPercentage >= 100) {
                return (
                    <div>
                        <span>{PreviousPercentage}%</span>
                        <span><Icon iconName="Trophy" style={{ color: "gold" }} /></span>
                    </div>
                );
            } else if (PreviousPercentage || PreviousPercentage === 0) {
                return (
                    <div>
                        <span>{PreviousPercentage}%</span>
                    </div>
                );
            } else {
                return null;
            }
        }
        case "PreviousValue": {
            if (PreviousValue || PreviousValue === 0) {
                return (
                    <div>
                        <span>{PreviousValue}</span>
                    </div>
                );
            } else {
                return null;
            }
        }
        case "LatestPercentage": {
            if (LatestPercentage || LatestPercentage === 0) {
                return (
                    <div style={{ position: "relative" }}>
                        <span>{LatestPercentage}%</span>
                        <span>
                            <TrendIcon
                                latestVal={LatestValue}
                                latestPercentage={LatestPercentage}
                                prevVal={PreviousValue}
                                shouldIncrease={ValueShouldIncrease} />
                        </span>
                    </div>
                );
            } else {
                return null;
            }
        }
        case "LatestValue": {
            if (LatestValue || LatestValue === 0) {
                return (
                    <div>
                        <span>{LatestValue}</span>
                        <span>
                            <TrendIcon
                                latestVal={LatestValue}
                                latestPercentage={LatestPercentage}
                                prevVal={PreviousValue}
                                shouldIncrease={ValueShouldIncrease} />
                        </span>
                    </div>
                );
            } else {
                return null;
            }
        }
        case "AllMeasurements": {
            if (item.Measurements.length > 0) {
                return (
                    <a href="#" onClick={e => showAllMeasurements(item)}>{__.getResource("BenefitsOverview_AllMeasurements")}</a>
                );
            }
            return null;
        }
        default: {
            return colValue;
        }
    }
};

export { Columns, _onRenderItemColumn };
