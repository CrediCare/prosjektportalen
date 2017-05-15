import * as React from "react";
import {
    DialogType,
    Icon,
} from "office-ui-fabric-react";
import NewProjectDialog from "./NewProjectDialog";
import INewProjectLinkProps from "./INewProjectLinkProps";
import INewProjectLinkState from "./INewProjectLinkState";

/**
 * New Project link
 */
export default class NewProjectLink extends React.PureComponent<INewProjectLinkProps, INewProjectLinkState> {
    public static defaultProps: Partial<INewProjectLinkProps> = {
        linkClassName: "ms-font-l",
        iconProps: {
            iconName: "CirclePlus",
            style: {
                verticalAlign: "bottom",
                marginRight: 5,
            },
        },
    };

    /**
     * Constructor
     */
    constructor() {
        super();
        this.state = {
            showDialog: false,
        };
    }

    /**
     * Renders the component
     */
    public render(): JSX.Element {
        const {
            linkClassName,
            iconProps,
         } = this.props;

        return (
            <div>
                <a
                    className={linkClassName}
                    href="#"
                    onClick={e => this.setState({ showDialog: true })}>
                    <Icon { ...iconProps } />
                    <span>{__("NewProjectForm_Header")}</span>
                </a>
                {this.renderDialog()}
            </div>
        );
    }

    /**
     * Renders the dialog
     */
    private renderDialog = () => {
        return (
            <NewProjectDialog
                dialogProps={{
                    isOpen: this.state.showDialog,
                    type: DialogType.largeHeader,
                    isDarkOverlay: true,
                    isBlocking: false,
                    title: __("NewProjectForm_DialogTitle"),
                    subText: "Opprett ett nytt prosjekt basert på Prosjektveiviseren",
                    className: "pp-newprojectdialog",
                    onDismiss: () => this.setState({ showDialog: false }),
                }} />
        );
    }
};
