import React, { Component } from 'react'
import { Button, Container, Image, Menu } from 'semantic-ui-react'
import { getTokenData } from './helpers/commonsHelpers'
import logo from './media/charts-icon.svg'

export default class Header extends Component {
	logOut() {
		localStorage.removeItem('authToken')
		window.location = '/rua-monitor'
	}

    render() {
		const token = localStorage.getItem('authToken')

        return token ? <Menu fixed='top' size='large'>
	        <Container>
		        <Menu.Item as='a' header>
			        <Image
				        size='mini'
				        src={logo}
				        style={{ marginRight: '1.5em' }}
			        />
			        RUA Monitor
		        </Menu.Item>
		        <Menu.Item as='a'>SRV12</Menu.Item>
		        <Menu.Item as='a'>SRV16</Menu.Item>
		        <Menu.Item as='a'>SRV17</Menu.Item>
		        <Menu.Item as='a'>Another metrics</Menu.Item>
		        <Menu.Menu position='right'>
			        <Menu.Item>
				        Hello, &nbsp;
				        <strong>{getTokenData(token)['given_name']}</strong>
			        </Menu.Item>
			        <Menu.Item>
				        <Button onClick={this.logOut} as='a' primary>Sign Out</Button>
			        </Menu.Item>
		        </Menu.Menu>
	        </Container>
        </Menu> : null
    }
}