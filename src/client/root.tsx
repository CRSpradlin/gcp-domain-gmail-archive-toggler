import React from "react";

export class Root extends React.Component {

	state = {
		emailValue: "",
		archivedValue: false,
		loading: false
	}

	constructor(props) {
		super(props);
	}

	public resetForm = () => {
		this.setState({
			emailValue: "",
			archivedValue: false
		});
	}

	public handleFormSuccess = () => {
		this.setState({ loading: false });
		alert('Request Successful!');
	}

	public handleFailure = () => {
		this.setState({ loading: false });
		alert('Failed to Send Update');
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

	public handleToggleSubmit = (e) => {
		console.log(e);
	}

	public render() {
		return (
			<div className="h-full flex flex-col content-center items-center">
				<form className="flex flex-col m-auto items-center" id="emailForm" onSubmit={this.handleEmailSubmit}>
					<div>
						<h1 className="text-xl">Add New Email</h1>
					</div>
					<div className="mt-10">
						<label>New Email: </label>
						<input name="email" value={this.state.emailValue} onChange={(e) => this.setState({ emailValue: e.target.value })} type="text" required/>
					</div>
					<div className="mt-10">
						<label>Archive Incoming Messsages: </label>
						<input name="archived" checked={this.state.archivedValue} onChange={(e) => this.setState({ archivedValue: e.target.value })} type="checkbox" />
					</div>
					<div className="mt-5">
						<input id="submit" type="submit" value={this.state.loading?"Submitting...":"Submit"} disabled={this.state.loading} className={`w-[10rem] ${this.state.loading ? 'bg-indigo-500' : ' bg-indigo-800 hover:bg-indigo-500'} px-5 py-2 text-sm rounded-full font-semibold text-white`}/>
					</div>
				</form>
				<form className="flex flex-col m-auto items-center" id="toggleForm" onSubmit={this.handleToggleSubmit}>

				</form>
			</div>
		);
	}
}