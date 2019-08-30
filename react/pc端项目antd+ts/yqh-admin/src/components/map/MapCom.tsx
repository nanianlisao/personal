import * as React from 'react';
import { Map, MouseTool, Marker } from 'react-amap';
export interface IMapComProps {
    defaultValue: null | {
        longitude: number,
        latitude: number
    }
    callback: (args?: any) => void
    width: string
    height: string
}

export interface IMapComState {
    position: any
}

export default class MapCom extends React.Component<IMapComProps, IMapComState> {
    static defaultProps = {
        width: "300px",
        height: "200px",
        defaultValue: null
    }
    public toolEvents: any
    public tool: any
    constructor(props: IMapComProps) {
        super(props);
        const self = this;
        this.state = {
            position: null
        };
        this.toolEvents = {
            created: (tool: any) => {
                self.tool = tool;
                self.tool.marker();
            },
            draw(e: { obj: any }) {
                self.setState({
                    position: null
                });
                self.position(e.obj);
            },
            complete(res: any) {
                console.log(res);
            }
        }
    }

    componentWillMount() {
        this.setState({
            position: this.props.defaultValue
        });
    }

    componentWillReceiveProps(props: IMapComProps) {
        if (props.defaultValue !== this.props.defaultValue) {
            if(this.state.position){
                this.tool.close(true);
                this.tool.marker();
            }
            this.setState({
                position: props.defaultValue
            })
        }

    }

    position = (obj: { getPosition: () => {}; }) => {
        this.tool.close(true);
        this.tool.marker();
        this.props.callback(obj.getPosition());
    }


    public render() {
        return (
            <div style={{ width: this.props.width, height: this.props.height }}>
                <Map
                    zoom={17}
                    plugins={['ToolBar']}
                    center={this.state.position ? this.state.position : ""}
                >
                    {this.state.position ? <Marker position={this.state.position} /> : ""}
                    <MouseTool
                        events={this.toolEvents}
                    />
                </Map>
            </div>
        )
    }
}
