/**
 * Created by chenlu on 2018/11/5.
 */
import React from "react";
import { Map, MouseTool, Marker } from 'react-amap';
class MapComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            position: {},
        };
    }
    static defaultProps = {
        width: "300px",
        height: "200px",
    }
    componentWillMount() {
        this.setState({
            position: this.props.position
        });
    }

    render() {
        console.log(this.state.position)
        return (
            <div style={{ width: this.props.width, height: this.props.height }}>
                <Map
                    zoom={17}
                    plugins={['ToolBar']}
                    center={this.state.position.longitude ? this.state.position : ""}
                >
                    {this.state.position.longitude ? <Marker position={this.state.position} /> : ""}
                </Map>
            </div>
        )
    }
}
export default MapComponent