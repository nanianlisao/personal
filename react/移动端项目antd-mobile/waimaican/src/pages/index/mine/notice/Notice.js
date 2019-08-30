import React from 'react'
import { Axios } from 'util/util'
export default class Notice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            html: '',
        };
    }
    componentWillMount() {
        document.title = '平台须知'
        this.getNotice()
    }

    async getNotice() {
        let res = await Axios.get('/notice/query')
        console.log(res)
        this.setState({
            html: res.data.text
        })
    }

    render() {
        return (
            <div style={{
                padding: '0.20rem 0.24rem 0.22rem 0.24rem',
                height: '100%',
                boxSizing: 'border-box'
            }}>
                <div className="shadow-box" style={{
                    minHeight: '100%',
                    padding: '0.30rem 0.34rem',
                    boxSizing: 'border-box'
                }}>
                    <div dangerouslySetInnerHTML={{
                        __html: this.state.html
                    }} />
                </div>
            </div>
        )
    }
}