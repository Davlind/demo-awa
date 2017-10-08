import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as MetricsState from '../store/Metrics';

// At runtime, Redux will merge together...
type MetricsProps =
    MetricsState.MetricsState        // ... state we've requested from the Redux store
    & typeof MetricsState.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{ startDateIndex: string }>; // ... plus incoming routing parameters

class FetchMetricsData extends React.Component<MetricsProps, {}> {

    renderError(): any {
        return <tr>
        <td colSpan={2} style={{color: '#cc0000'}}>{ this.props.error.toString()}</td>
    </tr>
    }
    latencyColor(): any {
        if (this.props.metrics.latency > 450) {
            return "red";
        }
        else if(this.props.metrics.latency > 200) {
            return "orange";
        }
        else {
            return "green";
        }
    }

    startPolling(): any {
        this.props.requestMetrics();
        setTimeout(this.startPolling.bind(this), 3000);
    }
    
    componentWillMount() {
        this.props.requestMetrics();
    }

    public componentDidMount() {
        this.startPolling();
    }

    public render() {
        return <div>
            { this.renderTable() }
            { this.renderButtons()}
        </div>;
    }

    private renderButtons() {
        return <div>
            <div>Latency: 
                <a onClick={ () => { this.props.modifyLatency(100) } }>Increase</a>/
                <a onClick={ () => { this.props.modifyLatency(-100) } }>Decrease</a>
            </div>
            <div>Memory:
                <a onClick={ () => { this.props.modifyMemLeak(1024 * 1000 * 100) } }>Increase</a>/
                <a onClick={ () => { this.props.modifyMemLeak(-1024 * 1000 * 100) } }>Decrease</a>
            </div>
            <div>
                <button onClick={ () => { this.props.modifyFaultState(!this.props.metrics.failedState) } }>
                { this.props.metrics.failedState ? "Stop throwing errors" : "Throw errors"  }
                </button>
            </div>
        </div>
    }

    private renderTable() {
        return <table className={this.props.tableCss}>
            <thead>
                <tr><th>Metric</th><th>Value</th></tr>
            </thead>
            <tbody>
                {this.props.error ? this.renderError() : null}
                
                <tr>
                    <td>Instance Name</td>
                    <td style={{fontWeight: 900}}>{this.props.metrics.instanceName}</td>
                </tr>
                <tr>
                    <td>Version</td>
                    <td>{this.props.metrics.version}</td>
                </tr>
                <tr>
                    <td>Last Fetched</td>
                    {<td>{new Date(this.props.lastFetched).toLocaleTimeString()}</td>}
                </tr>
                <tr>
                    <td>Latency</td>
                    <td><span style={{color: this.latencyColor()}}>{this.props.metrics.latency}</span> ({this.props.metrics.latencyOffset})</td>
                </tr>
                <tr>
                    <td>Memory Leak</td>
                    <td>{this.props.metrics.memoryLeak}</td>
                </tr>
            </tbody>
        </table>
    }

    // private renderForecastsTable() {
    //     return <table className='table'>
    //         <thead>
    //             <tr>
    //                 <th>Date</th>
    //                 <th>Temp. (C)</th>
    //                 <th>Temp. (F)</th>
    //                 <th>Summary</th>
    //             </tr>
    //         </thead>
    //         <tbody>
    //         {this.props.forecasts.map(forecast =>
    //             <tr key={ forecast.dateFormatted }>
    //                 <td>{ forecast.dateFormatted }</td>
    //                 <td>{ forecast.temperatureC }</td>
    //                 <td>{ forecast.temperatureF }</td>
    //                 <td>{ forecast.summary }</td>
    //             </tr>
    //         )}
    //         </tbody>
    //     </table>;
    // }

    // private renderPagination() {
    //     let prevStartDateIndex = (this.props.startDateIndex || 0) - 5;
    //     let nextStartDateIndex = (this.props.startDateIndex || 0) + 5;

    //     return <p className='clearfix text-center'>
    //         <Link className='btn btn-default pull-left' to={ `/fetchdata/${ prevStartDateIndex }` }>Previous</Link>
    //         <Link className='btn btn-default pull-right' to={ `/fetchdata/${ nextStartDateIndex }` }>Next</Link>
    //         { this.props.isLoading ? <span>Loading...</span> : [] }
    //     </p>;
    // }
}

export default connect(
    (state: ApplicationState) => state.metrics, // Selects which state properties are merged into the component's props
    MetricsState.actionCreators                 // Selects which action creators are merged into the component's props
)(FetchMetricsData) as typeof FetchMetricsData;
