import React from "react";

import "./toggleSwitch.css"

type ToggleSwitchProps = {
    toggled: boolean,
    onChange: (newValue: boolean) => void,
	disabled: boolean
}

export class ToggleSwitch extends React.Component<ToggleSwitchProps> {

	state = {
		toggled: false
	}

	constructor(props) {
        super(props)
	}

	public componentDidMount = () => {
        this.setState({ 
			toggled: this.props.toggled
		})
	}

	public componentDidUpdate(prevProps) {
		if (this.props.toggled !== prevProps.toggled) {
			this.setState({ toggled: this.props.toggled })
		}
	}

    onClickHandler = () => {
		if (!this.props.disabled) {
			this.props.onChange(!this.state.toggled)
			this.setState({ toggled: !this.state.toggled })
		}
    }

	public render() {
		return (
			<div className="toggleBox flex flex-col items-start h-6.5 w-12 rounded-full border-2 border-teal-950" onClick={() => this.onClickHandler()}>
                <div className={"togglePin h-6 w-6 rounded-full " + (this.state.toggled ? "togglePin-toggled bg-teal-400":"togglePin-untoggled bg-teal-800") + (this.props.disabled ? " !bg-slate-500" : "")}>
                </div>
				<input className="hidden" name="archived" checked={this.state.toggled} type="checkbox" />
			</div>
		);
	}
}