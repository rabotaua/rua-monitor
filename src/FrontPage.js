import React, { Component } from 'react'
import { getData } from './helpers/apiHelper'
import { bigSqlQuery } from './helpers/sqlQueries'
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

	getChartData() {
		this.setState({
			chartData: null
		})

		getData(bigSqlQuery).then(data => {
			if (data) {
				const formattedData = data.map(item => {
					return {
						...item,
						'dateTime': formatDateTime(item['minute'], 'HH:mm')
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

	componentWillMount() {
		this.getChartData()
	}

	render() {
		return <div style={{ marginBottom: 100 }}>

			<Header as='h1' dividing>Charts</Header>
			<br/>

			<SimpleLineChart
				chartTitle="RAM"
				xKey="dateTime"
				lineName="consumption RAM (mb)"
				lineKey="ram"
				chartData={this.state.chartData}
				refreshChartData={this.getChartData.bind(this)}
				stroke="#D383DB"
				strokeWidth={1.3}
			/>

			<SimpleLineChart
				chartTitle="CPU"
				xKey="dateTime"
				lineName="consumption CPU (percents)"
				lineKey="cpu"
				chartData={this.state.chartData}
				refreshChartData={this.getChartData.bind(this)}
				stroke="#81D9CA"
				strokeWidth={1.8}
				dot={null}
			/>

			<SimpleLineChart
				chartTitle="HDD"
				xKey="dateTime"
				lineName="Avg. Disk Queue Length"
				lineKey="hdd_queue"
				chartData={this.state.chartData}
				refreshChartData={this.getChartData.bind(this)}
				stroke="#2F47B8"
				strokeWidth={2}
				dot={{ stroke: "#3269B5", strokeWidth: 2 }}
			/>

			<SimpleLineChart
				chartTitle="Swap"
				xKey="dateTime"
				lineName="Swap"
				lineKey="swap"
				chartData={this.state.chartData}
				refreshChartData={this.getChartData.bind(this)}
				stroke="#6F6CB2"
			/>

			<SimpleLineChart
				chartTitle="ElasticSearch"
				xKey="dateTime"
				lineName="avg elastic search response time ms"
				lineKey="elastic_avg_search"
				chartData={this.state.chartData}
				refreshChartData={this.getChartData.bind(this)}
				stroke="#FF3535"
				strokeWidth={2}
				dot={{ stroke: "#27BC78", strokeWidth: 0.5 }}
			/>

			<SimpleLineChart
				chartTitle="ASP"
				xKey="dateTime"
				lineName="asp requests per second"
				lineKey="asp_rps"
				chartData={this.state.chartData}
				refreshChartData={this.getChartData.bind(this)}
				stroke="#1FC844"
				strokeWidth={3}
			/>

			<br/>
			<br/>

			<Header as='h1' dividing>Redis</Header>
			<br/>

			<SimpleLineChart
				chartTitle="Redis Ops"
				xKey="dateTime"
				lineName="redis_ops"
				lineKey="redis_ops"
				chartData={this.state.chartData}
				refreshChartData={this.getChartData.bind(this)}
				stroke="blue"
				strokeWidth={2}
			/>

			<SimpleLineChart
				chartTitle="Redis RAM"
				xKey="dateTime"
				lineName="redis_ram"
				lineKey="redis_ram"
				chartData={this.state.chartData}
				refreshChartData={this.getChartData.bind(this)}
				stroke="blue"
				strokeWidth={2}
			/>

			<SimpleLineChart
				chartTitle="Redis RAM Fragmentation"
				xKey="dateTime"
				lineName="redis_ram_fragmentation"
				lineKey="redis_ram_fragmentation"
				chartData={this.state.chartData}
				refreshChartData={this.getChartData.bind(this)}
				stroke="blue"
				strokeWidth={2}
			/>

		</div>
	}
}