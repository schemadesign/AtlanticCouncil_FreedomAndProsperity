import { FreedomSubIndicator, IndexType } from "../@enums/IndexType";

export type ChartLabelPosition = {
    key: string,
    y: number,
    initialY: number,
    label?: string,
}

export interface IChartIndicator {
    key: IndexType | FreedomSubIndicator | string,
    color: string,
    subindicator?: boolean,
    label: string,
}