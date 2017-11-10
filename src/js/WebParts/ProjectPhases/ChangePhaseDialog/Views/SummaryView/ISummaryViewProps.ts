import { PhaseModel } from "../../../../../Model";
import IChecklistItem from "../../../ProjectPhasesData/IChecklistItem";

export default interface ISummaryViewProps {
    phase: PhaseModel;
    checkListItems: IChecklistItem[];
    listClassName?: string;
}
