import React, { Component } from 'react';
import {Dropdown, Container, Table} from 'semantic-ui-react'
import beautify from 'json-beautify'
import _ from "lodash"
import {XYPlot, LineSeries, MarkSeries, XAxis, YAxis} from 'react-vis'

class ResearcherDashboard extends Component{

    constructor(props){
        super(props);
        this.state = {selectIndex: -1, data: this.props.data, dataShown: "No data", options: [], selectedValue: ""}


        // A data will be passed
        // {username:{logs:{}, saves:{}}
    }

    parseLogsToTables = (logs) =>{

        // {"asdas":{"":"", "":""}}
        // _.head()
        let values = _.values(logs);
        if (values.length === 0){
            return (
                <div></div>
            )
        }

        let logsNums = _.keys(logs)
        let headers = _.keys(_.values(logs)[0])

        return (
        <Table cell>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell> Log Number </Table.HeaderCell>
                    { _.map( headers, h => { return ( <Table.HeaderCell> {h} </Table.HeaderCell> ) }   ) }
                </Table.Row>
            </Table.Header>
            <Table.Body>

                {  _.map( logsNums, n => {

                        let log = logs[n]

                        return(

                            <Table.Row>
                                <Table.Cell> {n} </Table.Cell>
                                { _.map( headers, h=>{
                                        return (<Table.Cell > {log[h]} </Table.Cell>)
                                    }
                                ) }
                            </Table.Row>


                        )
                    }
                    )
                }

            </Table.Body>


        </Table>
        )
    }

    createOptions = (data) =>{
        let options = []

        for (let k in data ){
            let newOpt = {};
            newOpt["text"] = k;
            newOpt["value"] = k;
            options.push(newOpt)
        }

        this.setState({options: options})
    }

    componentDidUpdate(prevProps){
        if (this.props.data !== prevProps.data){
           this.createOptions(this.props.data)
        }
    }

    handleChange = (e, { value }) => this.setState({selectedValue:value, dataShown: this.props.data[value]});

    parseLogsToCharts = (logs) =>{

        // Here is what I think I should do
        // First, get the epoch time and
        let values = _.values(logs);
        if (values.length === 0){
            return (
                <div></div>
            )
        }

        // For us, log number is not important
        // What important is currentScreen and epochTime
        // Use a plot chat
        // X is epoche time
        // Y is currentScreen


        let logsNums = _.keys(logs)
        let headers = _.keys(_.values(logs)[0])

        let data = values.map( l => { return {x: l["epochTime"], y:l["currentScreen"] }} )
        let uniqueItems = Array.from(new Set(values.map( l => l["currentScreen"])))

        let uniqueItemsMap = {}

        uniqueItems.forEach((d,i) => {uniqueItemsMap[d] = i})

        data = data.map( (d,i)=>
        {

            return {x:d.x, y: uniqueItemsMap[d.y]}}

        ).slice(0,100);


        console.log(data)

        // console.log(data)
        return (
            // yType={"ordinal"} yDomain={uniqueItems} yRange={Array(10).map((d, i) => i)}
            <XYPlot height={1000} width={1000}>
                <MarkSeries  data = {data}/>
                {/*<XAxis/>*/}
                <YAxis/>
            </XYPlot>
        )


        // How should I start to think



        //

    }


    render(){
        return (


            <div>
                <Dropdown placeholder= "Select a student data"  selection options={this.state.options} onChange={this.handleChange}/>
                {
                    this.state.selectedValue === ""?
                        this.parseLogsToTables({}) :

                        this.parseLogsToTables( this.props.data[this.state.selectedValue].logs )}

                {/*<Dropdown placeholder= "Select a student data"  selection options={this.state.options} onChange={this.handleChange}/>*/}
                {/*{*/}
                    {/*this.state.selectedValue === ""?*/}
                        {/*this.parseLogsToCharts({}) :*/}

                        {/*this.parseLogsToCharts(this.props.data[this.state.selectedValue].logs)}*/}
            </div>



        )

    }
}
export default ResearcherDashboard;