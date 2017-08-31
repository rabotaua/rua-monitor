import React, { Component } from 'react'
import {
	BrowserRouter as Router, Redirect,
	Route
} from 'react-router-dom'
import SignIn from './SignIn'
import MainPage from './FrontPage'
import Header from './Header'
import { Container } from 'semantic-ui-react'

export default class App extends Component {
	render() {
		return <Router>
			<div>
				<Header />
				<Container style={{ paddingTop: 100 }}>
					<Route exact path="/rua-monitor/" component={SignIn}/>
					<Route path="/rua-monitor/front-page" component={MainPage}/>
					<Route component={MainPage}/>
				</Container>
			</div>
		</Router>
	}
}
