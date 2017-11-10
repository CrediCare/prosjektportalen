//#region Imports
import RESOURCE_MANAGER from "../../@localization";
import * as React from "react";
import { Spinner, SpinnerType } from "office-ui-fabric-react/lib/Spinner";
import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/MessageBar";
import ProjectPhase from "./ProjectPhase";
import ChangePhaseDialog, { ChangePhaseDialogResult } from "./ChangePhaseDialog";
import * as Project from "../../Project";
import { fetchData } from "./ProjectPhasesData";
import { PhaseModel } from "../../Model";
import { cleanString } from "../../Util";
import IProjectPhasesProps, { ProjectPhasesDefaultProps } from "./IProjectPhasesProps";
import IProjectPhasesState from "./IProjectPhasesState";
import BaseWebPart from "../@BaseWebPart";
//#endregion

/**
 * Project Phases
 */
export default class ProjectPhases extends BaseWebPart<IProjectPhasesProps, IProjectPhasesState> {
    public static displayName = "ProjectPhases";
    public static defaultProps = ProjectPhasesDefaultProps;

    /**
     * Constructor
     *
     * @param {IProjectPhasesProps} props Props
     */
    constructor(props: IProjectPhasesProps) {
        super(props, { isLoading: true });
        this._onChangePhase = this._onChangePhase.bind(this);
        this._onRestartPhase = this._onRestartPhase.bind(this);
        this._onChangePhaseDialogReturnCallback = this._onChangePhaseDialogReturnCallback.bind(this);
        this._onHideDialog = this._onHideDialog.bind(this);
    }

    public async componentDidMount() {
        try {
            const data = await fetchData();
            this.setState({
                data,
                isLoading: false,
            });
        } catch {
            // Catch error
        }
    }

    public render(): JSX.Element {
        if (this.state.isLoading) {
            return <Spinner type={SpinnerType.large} label={RESOURCE_MANAGER.getResource("ProjectPhases_LoadingText")} />;
        }
        return (
            <div>
                {this.renderPhases()}
                {this.renderDialog()}
                <div hidden={this.isPhaseSet()}>
                    <MessageBar messageBarType={MessageBarType.info}>
                        {RESOURCE_MANAGER.getResource("ProjectPhases_PhaseNotSetText")}
                    </MessageBar>
                </div>
            </div>
        );
    }

    /**
     * Render phases
     */
    private renderPhases(): JSX.Element {
        const { data } = this.state;
        return (
            <ul>
                {data.phases.map((phase, index) => {
                    const classList = this.getPhaseClassList(phase);
                    let changePhaseEnabled = !Array.contains(classList, "selected");
                    if (this.props.forcedOrder && data.activePhase) {
                        changePhaseEnabled = phase.Index === data.activePhase.Index + 1;
                    }
                    return (
                        <ProjectPhase
                            key={`ProjectPhase_${index}`}
                            phase={phase}
                            classList={classList}
                            checkListData={data.checkListData[phase.Id]}
                            checkListDefaultViewUrl={data.checkListDefaultViewUrl}
                            changePhaseEnabled={changePhaseEnabled}
                            onRestartPhase={this._onRestartPhase}
                            onChangePhase={this._onChangePhase} />
                    );
                })}
            </ul>
        );
    }

    /**
     * Render dialog
     */
    private renderDialog(): JSX.Element {
        if (!this.state.newPhase) {
            return null;
        }
        const { data, newPhase } = this.state;
        const checkListItems = data.checkListData[data.activePhase.Id] ? data.checkListData[data.activePhase.Id].items : [];
        return (
            <ChangePhaseDialog
                newPhase={newPhase}
                activePhase={data.activePhase}
                checkListItems={checkListItems}
                onChangePhaseDialogReturnCallback={this._onChangePhaseDialogReturnCallback}
                hideHandler={this._onHideDialog} />
        );
    }

    /**
     * Get classnames for a phase
     *
     * @param {any} phase The phase
     */
    private getPhaseClassList(phase): string[] {
        const { data } = this.state;
        const isFirst = phase.Index === 0;
        const isLast = (phase.Index === (data.phases.length - 1));
        const isSelected = (data.activePhase && (phase.Name === data.activePhase.Name));
        return [
            `level-${cleanString(phase.PhaseLevel)}`,
            `type-${cleanString(phase.Type)}`,
            isFirst && "first-phase",
            isLast && "last-phase",
            isSelected && "selected",
        ].filter(className => className);
    }

    /**
     * On change phase
     *
     * @param {PhaseModel} phase New phase
     */
    private _onChangePhase(phase: PhaseModel) {
        this.setState({ newPhase: phase });
    }

    /**
     * On restart phase
     *
     * @param {PhaseModel} phase Phase to restart
     */
    private _onRestartPhase(phase: PhaseModel) {
        const { data } = this.state;
        const phaseGateIndex = phase.Index - 1;
        const [phaseGate] = data.phases.filter(p => p.Index === phaseGateIndex && p.Type === "Gate");
        this.setState({ newPhase: phaseGate ? phaseGate : phase });
    }

    /**
     * On confirm phase dialog return callback
     *
     * @param {ChangePhaseDialogResult} result Result
     */
    private async _onChangePhaseDialogReturnCallback(result: ChangePhaseDialogResult) {
        const { data } = this.state;
        switch (result) {
            case ChangePhaseDialogResult.Approved: {
                await Project.ChangeProjectPhase(this.state.newPhase, false);
            }
                break;
            case ChangePhaseDialogResult.ProvisionallyApproved: {
                await Project.ChangeProjectPhase(this.state.newPhase, false);
            }
                break;
            case ChangePhaseDialogResult.Rejected: {
                const prevPhaseIndex = data.activePhase.Index - 1;
                const [prevPhase] = data.phases.filter(p => p.Index === prevPhaseIndex);
                await Project.ChangeProjectPhase(prevPhase, false);
            }
                break;
        }
    }

    /**
     * On hide dialog
     */
    private _onHideDialog() {
        this.setState({ newPhase: null });
    }

    /**
     * Checks if phase is set
     */
    private isPhaseSet(): boolean {
        const { data } = this.state;
        return data.activePhase && data.activePhase.Name && data.activePhase.Name !== "";
    }
}

export {
    IProjectPhasesProps,
    IProjectPhasesState,
};
