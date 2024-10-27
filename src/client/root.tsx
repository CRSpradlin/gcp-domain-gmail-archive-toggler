import React from "react";
import { ToggleSwitch } from "./toggleSwitch";

export class Root extends React.Component {

	state = {
		emailValue: "",
		archivedValue: false,
		loading: false,
		emailList: []
	}

	constructor(props) {
		super(props);
	}

	public componentDidMount = () => {
		this.setState({ loading: true });
		this.getEmailList();
	};

	public resetForm = () => {
		this.setState({
			emailValue: "",
			archivedValue: false
		});
	}

	public getEmailList = () => {
		// @ts-ignore
		google.script.run
		.withSuccessHandler(this.setEmailList)
		.withFailureHandler(this.handleFailure)
		.GetEmailList();
	}

	public setEmailList = (data) => {
		this.setState({ emailList: data, loading: false });
	}

	public handleFormSuccess = (response) => {
		this.setState({ loading: false, emailList: response });
		alert('Request Successful!');
	}

	public handleToggleSuccess = (response) => {
		this.setState({ loading: false, emailList: response })
	}

	public handleFailure = () => {
		this.setState({ loading: false });
		alert('Failed to Process Request');
	}

	public handleEmailSubmit = (e) => {
		e.preventDefault();
		this.setState({ loading: true });

		// @ts-ignore
		google.script.run
		.withSuccessHandler(this.handleFormSuccess)
		.withFailureHandler(this.handleFailure)
		.SubmitNewEmailForm(document.getElementById('emailForm'));

		this.resetForm();
	}

	public handleToggleSubmit = (email) => {
		this.setState({ loading: true });

		// @ts-ignore
		google.script.run
		.withSuccessHandler(this.handleToggleSuccess)
		.withFailureHandler(this.handleFailure)
		.ToggleEmail(email);
	}

	public render() {
		return (
			<div className="h-full flex flex-col text-teal-950">
				<form className="flex flex-col mt-10 mr-auto ml-auto items-center" id="emailForm" onSubmit={this.handleEmailSubmit}>
					<div>
						<h1 className="text-xl">Add New Email</h1>
					</div>
					<div className="mt-10">
						<label>New Email: </label>
						<input name="email" value={this.state.emailValue} onChange={(e) => this.setState({ emailValue: e.target.value })} type="text" required/>
					</div>
					<div className="mt-10 flex flex-row items-center place-itmes-center">
						<span className="mr-1">Show Email in Inbox?:</span>
						<ToggleSwitch disabled={this.state.loading} toggled={this.state.archivedValue} onChange={(newValue) => this.setState({ archivedValue: newValue })} />
					</div>
					<div className="mt-5">
						<input id="submit" type="submit" value={this.state.loading?"Submitting...":"Submit"} disabled={this.state.loading} className={`w-[10rem] ${this.state.loading ? 'bg-teal-500' : ' bg-teal-800 hover:bg-teal-500'} px-5 py-2 text-sm rounded-full font-semibold text-white`}/>
					</div>
				</form>

				<div className="flex flex-col mt-20 mb-auto ml-auto mr-auto">
					{this.state.emailList.map(emailItem => (
						<div className="flex flex-row m-2 items-center place-items-center">
							<span className="mr-1">{emailItem[0]}:</span>
							<ToggleSwitch disabled={this.state.loading} toggled={Boolean(emailItem[1])} onChange={() => this.handleToggleSubmit(emailItem[0])} />
						</div>
					))}
				</div>
			</div>
		);
	}
}