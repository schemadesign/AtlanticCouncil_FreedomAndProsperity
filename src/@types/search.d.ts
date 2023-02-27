import { WellbeingDataType } from "../@enums/wellbeing-data";

export interface ISearch {
    id: string | null;
    type: WellbeingDataType | null;
    open: boolean;
    caseStory: boolean;
}
export type SearchContextType = {
    value: ISearch;
    setValue: (Search: ISearch) => void;
};