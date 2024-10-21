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
        super(props);
        
        this.setState({ enabled: this.props.enabled === true ? true : false})
	}

    onClickHandler = () => {
        this.props.onChange(!this.state.enabled)
        this.setState({ enabled: !this.state.enabled })
    }

	public render() {
		return (
			<div className="toggleBox flex flex-col items-start w-6 rounded-full border border-black" onClick={() => this.onClickHandler()}>
                <div className={"togglePin h-3 w-3 rounded-full bg-red-600 " + (this.state.enabled ? "togglePin-enabled":"togglePin-disabled")}>

                </div>
			</div>
		);
	}
}