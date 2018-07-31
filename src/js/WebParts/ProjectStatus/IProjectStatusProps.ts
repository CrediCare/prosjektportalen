import __ from "../../Resources";
import { IBaseWebPartProps } from "../@BaseWebPart";
import IProjectStatusSectionConfig from "./IProjectStatusSectionConfig";

export default interface IProjectStatusProps extends IBaseWebPartProps {
    sectionConfig?: IProjectStatusSectionConfig;
    welcomePageId?: number;
}

export const ProjectStatusDefaultProps: Partial<IProjectStatusProps> = {
    sectionConfig: {
        listTitle: __.getResource("Lists_StatusSections_Title"),
        orderBy: "GtStSecOrder",
    },
    welcomePageId: 3,
};
