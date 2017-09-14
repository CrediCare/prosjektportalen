import * as React from "react";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import IInitialViewProps, { InitialViewDefaultProps } from "./IInitialViewProps";
import IInitialViewState from "./IInitialViewState";

/**
 * Initial view
 */
export default class InitialView extends React.Component<IInitialViewProps, IInitialViewState> {
    public static defaultProps = InitialViewDefaultProps;
    private commentsField: HTMLTextAreaElement;

    /**
     * Constructor
     *
     * @param {IInitialViewProps} props Props
     */
    constructor(props: IInitialViewProps) {
        super(props);
        this.state = {
            comment: props.currentChecklistItem ? (props.currentChecklistItem.GtComment || "") : "",
        };
    }

    /**
     * Calls _render with props and state to allow for ES6 destruction to allow for ES6 destruction
     */
    public render(): JSX.Element {
        return this._render(this.props, this.state);
    }

    /**
     * Renders the component
     *
     * @param {IInitialViewProps} param0 Props
     * @param {IInitialViewState} param1 State
     */
    public _render({ currentChecklistItem, className, commentPlaceholder, commentClassName, commentStyle }: IInitialViewProps, { }: IInitialViewState): JSX.Element {
        if (!currentChecklistItem) {
            return null;
        }
        const {
            ID,
            Title,
            GtComment,
         } = currentChecklistItem;

        return (
            <div className={className}>
                <h3>#{ID} {Title}</h3>
                <textarea
                    placeholder={commentPlaceholder}
                    className={commentClassName}
                    style={commentStyle}
                    ref={ele => this.commentsField = ele}
                    onKeyUp={({ currentTarget }) => this.setState({ comment: currentTarget.value })}>
                    {GtComment}
                </textarea>
                {this.renderStatusOptions(this.props, this.state)}
            </div>
        );
    }

    /**
     * Status options
     *
     * @param {IInitialViewProps} param0 Props
     * @param {IInitialViewState} param1 State
     */
    private renderStatusOptions = ({ isLoading, nextCheckPointAction, commentMinLength }: IInitialViewProps, { comment }: IInitialViewState) => {
        const isCommentValid = (comment.length >= commentMinLength) && /\S/.test(comment);
        const options = [
            {
                value: __("Choice_GtChecklistStatus_NotRelevant"),
                disabled: (isLoading || !isCommentValid),
                tooltip: !isCommentValid ? __("ProjectPhases_CheckpointNotRelevantTooltip_CommentEmpty") : __("ProjectPhases_CheckpointNotRelevantTooltip"),
                updateStatus: true,
            },
            {
                value: __("Choice_GtChecklistStatus_StillOpen"),
                disabled: (isLoading || !isCommentValid),
                tooltip: !isCommentValid ? __("ProjectPhases_CheckpointStillOpenTooltip_CommentEmpty") : __("ProjectPhases_CheckpointStillOpenTooltip"),
                updateStatus: false,
            },
            {
                value: __("Choice_GtChecklistStatus_Closed"),
                disabled: isLoading,
                tooltip: __("ProjectPhases_CheckpointDoneTooltip"),
                updateStatus: true,
            }];
        return (
            <div style={{
                marginTop: 20,
                marginBottom: 25,
            }}>
                {options.map((opt, key) => (
                    <span
                        key={key}
                        title={opt.tooltip}>
                        <PrimaryButton
                            disabled={opt.disabled}
                            onClick={e => {
                                nextCheckPointAction(opt.value, comment, opt.updateStatus);
                                this.resetCommentField();
                            }}>{opt.value}</PrimaryButton>
                    </span>
                ))}
            </div>
        );
    }

    /**
     * Resets comments field
     */
    private resetCommentField = () => {
        this.setState({ comment: "" }, () => {
            this.commentsField.value = "";
        });
    }
}
