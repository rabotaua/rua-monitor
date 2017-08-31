import React, { Component } from 'react'
import { getData } from './helpers/apiHelper'
import { bigSqlQuery, jsErrorSqlQuery } from './helpers/sqlQueries'
import { formatDateTime } from './helpers/formatDateTime'
import { Container, Divider, Header } from 'semantic-ui-react'
import SimpleLineChart from './SimpleLineChart'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ReactSpeedometer from "react-d3-speedometer"


export default class FrontPage extends Component {
	constructor() {
		super()

		this.state = {
			showSpeedometer: false,
			chartData: null,
			jsErrorChartData: null
		}
	}

	getChartData() {
		this.setState({
			chartData: null,
			jsErrorChartData: null,
			showSpeedometer: false
		})

		getData(bigSqlQuery).then(data => {
			if (data) {
				const formattedData = data.map(item => {
					return {
						...item,
						'dateTime': formatDateTime(item['minute'], 'HH:mm'),
						redis_ram: parseInt(item['redis_ram'] / 1000000, 10)
					}
				})

				this.setState({
					chartData: formattedData
				})

				setTimeout(() => {
					this.setState({ showSpeedometer: true })
				}, 1500)

			}
		}).catch((e) => {
			this.setState({ chartData: false })
			throw e
		})






		getData(jsErrorSqlQuery).then(data => {
			if (data) {
				const formattedData = data.map(item => {
					return {
						...item,
						'dateTime': formatDateTime(item['minute'], 'HH:mm')
					}
				})

				this.setState({
					jsErrorChartData: formattedData
				})
			}
		}).catch((e) => {
			this.setState({ jsErrorChartData: false })
			throw e
		})
	}

	componentWillMount() {
		this.getChartData()
	}

	render() {
		const { chartData, showSpeedometer } = this.state

		const lastCpuVal = chartData && chartData.length ? chartData[chartData.length - 1]['cpu'] : null
		const lastRamVal = chartData && chartData.length ? chartData[chartData.length - 1]['ram'] : null

		return <div style={{ marginBottom: 100 }}>

			<Header as='h1' dividing>Charts</Header>
			<br/>

			<SimpleLineChart
				chartTitle="RAM"
				xKey="dateTime"
				lineName="consumption RAM (mb)"
				lineKey="ram"
				chartData={chartData}
				refreshChartData={this.getChartData.bind(this)}
				stroke="#D383DB"
				strokeWidth={1.3}
			>
				{ showSpeedometer ? <Container textAlign="center">
					<ReactSpeedometer
						startColor="#33CC33"
						endColor="#FF3535"
						minValue={0}
						maxValue={32000}
						segments={8}
						needleTransitionDuration={4000}
						needleTransition="easeElastic"
						value={lastRamVal}
					/>
				</Container> : null }
			</SimpleLineChart>

			<SimpleLineChart
				chartTitle="CPU"
				xKey="dateTime"
				lineName="consumption CPU (percents)"
				lineKey="cpu"
				chartData={chartData}
				refreshChartData={this.getChartData.bind(this)}
				stroke="#81D9CA"
				strokeWidth={1.8}
				dot={null}
			>
				{ showSpeedometer ? <Container textAlign="center">
					<ReactSpeedometer
						startColor="#33CC33"
						endColor="#FF3535"
						minValue={0}
						maxValue={100}
						needleTransitionDuration={3000}
						needleTransition="easeElastic"
						value={lastCpuVal}
					/>
				</Container> : null }
			</SimpleLineChart>

			<SimpleLineChart
				chartTitle="HDD"
				xKey="dateTime"
				lineName="Avg. Disk Queue Length"
				lineKey="hdd_queue"
				chartData={chartData}
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
				chartData={chartData}
				refreshChartData={this.getChartData.bind(this)}
				stroke="#6F6CB2"
			/>

			<SimpleLineChart
				chartTitle="ElasticSearch"
				xKey="dateTime"
				lineName="avg elastic search response time ms"
				lineKey="elastic_avg_search"
				chartData={chartData}
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
				chartData={chartData}
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
				chartData={chartData}
				refreshChartData={this.getChartData.bind(this)}
				stroke="blue"
				strokeWidth={2}
			/>

			<SimpleLineChart
				chartTitle="Redis RAM"
				xKey="dateTime"
				lineName="redis_ram"
				lineKey="redis_ram"
				chartData={chartData}
				refreshChartData={this.getChartData.bind(this)}
				stroke="blue"
				strokeWidth={2}
			/>

			<SimpleLineChart
				chartTitle="Redis RAM Fragmentation"
				xKey="dateTime"
				lineName="redis_ram_fragmentation"
				lineKey="redis_ram_fragmentation"
				chartData={chartData}
				refreshChartData={this.getChartData.bind(this)}
				stroke="blue"
				strokeWidth={2}
			/>


			<br/>
			<br/>

			<Header as='h1' dividing>GA and Javascript errors </Header>
			<br/>


			<SimpleLineChart
				chartTitle="Javascript errors"
				xKey="dateTime"
				lineName="count of errors"
				lineKey="js_errors"
				chartData={this.state.jsErrorChartData}
				refreshChartData={this.getChartData.bind(this)}
				stroke="red"
				strokeWidth={3}
			/>


			{ this.state.jsErrorChartData ? <div>
				<Header as='h3'>Hits</Header>
				<ResponsiveContainer width="100%" height={300}>
					<BarChart data={this.state.jsErrorChartData}>
						<XAxis dataKey="dateTime" />
						<YAxis />
						<CartesianGrid strokeDasharray="3 3" />
						<Tooltip />
						<Legend />
						<Bar dataKey="hits" fill="#8884d8" />
					</BarChart>
				</ResponsiveContainer>
			</div>: null }

		</div>
	}
}