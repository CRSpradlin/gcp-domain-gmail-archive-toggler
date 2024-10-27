import React from "react";

import "./toggleSwitch.css"

type ToggleSwitchProps = {
    enabled: boolean,
    onChange: (newValue: boolean) => void
}

export class ToggleSwitch extends React.Component<ToggleSwitchProps> {

	state = {
		enabled: false,
	}

	constructor(props) {
        super(props)
	}

	public componentDidMount = () => {
        this.setState({ enabled: this.props.enabled })
		console.log(this.props.enabled)
	};

    onClickHandler = () => {
        this.props.onChange(!this.state.enabled)
        this.setState({ enabled: !this.state.enabled })
    }

	public render() {
		return (
			<div className="toggleBox flex flex-col items-start h-3.5 w-6 rounded-full border border-teal-950" onClick={() => this.onClickHandler()}>
                <div className={"togglePin h-3 w-3 rounded-full " + (this.state.enabled ? "togglePin-enabled bg-teal-400":"togglePin-disabled bg-teal-800")}>
                </div>
				<input className="hidden" name="archived" checked={this.state.enabled} type="checkbox" />
			</div>
		);
	}
}