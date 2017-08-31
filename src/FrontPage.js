import React, { Component } from 'react'
import { getData } from './helpers/apiHelper'
import { RamCpuSqlQuery } from './helpers/sqlQueries'
import { formatDateTime } from './helpers/formatDateTime'
import { Header } from 'semantic-ui-react'
import SimpleLineChart from './SimpleLineChart'


export default class FrontPage extends Component {
	constructor() {
		super()

		this.state = {
			chartData: null
		}
	}

	componentDidMount() {
		this.getChartData()
	}

	getChartData() {
		this.setState({
			chartData: null
		})

		getData(RamCpuSqlQuery).then(data => {
			if (data) {
				const formattedData = data.map(item => {
					return {
						'dateTime': formatDateTime(item[0], 'HH:mm'),
						'elastic': item[1]
					}
				})

				this.setState({
					chartData: formattedData
				})
			}
		}).catch((e) => {
			this.setState({ chartData: false })
			throw e
		})
	}

	render() {
		return <div>

			<Header as='h1' dividing>Charts</Header>
			<br/>

			<SimpleLineChart
				chartTitle="Elastic"
				xKey="dateTime"
				lineName="avg elastic search response time ms"
				lineKey="elastic"
				chartData={this.state.chartData}
				refreshChartData={this.getChartData.bind(this)}
			/>

		</div>
	}
}