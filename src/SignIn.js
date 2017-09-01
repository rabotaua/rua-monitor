import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { getTokenApi } from './helpers/apiHelper'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import chartIcon from './media/charts-icon.svg'
import { checkExpireToken } from './helpers/commonsHelpers'

export default class SignIn extends Component {
	constructor() {
		super()

		this.state = {
			pendingRequest: false,
			authError: null
		}

		this.inputs = {}
	}

	changeInput(e, type) {
		this.inputs[type] = e.target.value.trim()
	}

	checkToken() {
		return checkExpireToken(localStorage.getItem('authToken'))
	}

	submit(e) {
		e.preventDefault()

		const login = this.inputs['login']
		const password = this.inputs['password']

		if (login && password && login.length && password.length) {
			this.setState({ pendingRequest: true })

			getTokenApi(login, password)
				.then(r => {
					if (r.data && r.data.length) {
						localStorage.setItem('authToken', r.data)
						this.forceUpdate()
					}
				})
				.catch(({ response }) => {
					this.setState({
						authError: response.request.responseText,
						pendingRequest: false
					})
				})
		}
	}

	render() {
		if (this.checkToken()) return <Redirect to="/rua-monitor/front-page"/>

		return <div style={{ paddingTop: 100 }}>
			<Grid textAlign='center' verticalAlign='middle'>
				<Grid.Column style={{ maxWidth: 500 }}>
					<Header as='h2' color='teal' textAlign='center'>
						<Image src={chartIcon}/>
						{' RUA Monitor '}
					</Header>

					<Form size='large' onSubmit={this.submit.bind(this)}>
						<Segment stacked>
							<Form.Input
								fluid
								icon='user'
								iconPosition='left'
								placeholder='E-mail address'
								onChange={(e) => this.changeInput(e, 'login')}
							/>
							<Form.Input
								fluid
								icon='lock'
								iconPosition='left'
								placeholder='Password'
								type='password'
								onChange={(e) => this.changeInput(e, 'password')}
							/>

							<Button style={{ maxHeight: 42 }} loading={this.state.pendingRequest} color='teal' size="large" fluid>Login</Button>
						</Segment>
					</Form>

					{this.state.authError
						? <Message size="mini" error>{this.state.authError}</Message>
						: null
					}

				</Grid.Column>

			</Grid>
		</div>
	}
}