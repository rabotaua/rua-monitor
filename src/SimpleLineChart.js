import React, { Component } from 'react'
import { Grid, Button, Header, Icon, Image, Loader, Segment } from 'semantic-ui-react'
import loaderWireframe from './media/loader-wireframe.png'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import './media/chart-loader.css'
import spaceBg from './media/space-bg.jpg'


export default class SimpleLineChart extends Component {
	loaderWrap() {
		return <Segment style={{ height: 300 }}>
			<div>
				<div className="loading" style={{ marginTop: 70 }}>
					<div className="loading-1"/>
					<div className="loading-2"/>
					<div className="loading-3"/>
					<div className="loading-4"/>
				</div>
			</div>
		</Segment>
	}

	errorWrap() {
		return <Segment textAlign="center" style={{ height: 300, background: `url(${spaceBg})`, backgroundSize: 'cover' }}>
			<Header as='h1' style={{ textTransform: 'uppercase', marginTop: 120, color: '#fff' }}>
				Houston, we have a problem!
			</Header>
		</Segment>
	}

	render() {
		const { chartData, refreshChartData, chartTitle, xKey, lineKey, lineName } = this.props

		let keys = null
		if (chartData) {
			keys = Object.keys(chartData[0])
		}

		return <div>
			<Grid>
				<Grid.Column width={5}>
					<Header as='h3'>{chartTitle}</Header>
				</Grid.Column>

				<Grid.Column floated="right" style={{ marginRight: 10 }}>
					<Button disabled={chartData === null} animated='vertical' size="tiny" circular onClick={refreshChartData}>
						<Button.Content hidden>Refresh</Button.Content>
						<Button.Content visible>
							<Icon name='refresh'/>
						</Button.Content>
					</Button>
				</Grid.Column>
			</Grid>

			{chartData === null ? this.loaderWrap() : null}
			{chartData === false ? this.errorWrap() : null}

			{chartData ? <ResponsiveContainer width="100%" height={300}>
				<LineChart data={chartData}
				           margin={{ top: 20, bottom: 20 }}>
					<XAxis dataKey={xKey}/>
					<YAxis/>
					<CartesianGrid strokeDasharray="5 5"/>
					<Tooltip/>
					<Legend/>
					<Line type="monotone" name={lineName} dataKey={lineKey} stroke="#8884d8" activeDot={{ r: 8 }}/>
				</LineChart>
			</ResponsiveContainer> : null}
		</div>
	}
}