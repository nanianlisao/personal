import React from 'react'
export default class BannerList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ''
        }
    }
    componentWillMount() {
        let text = localStorage.getItem('bannerDetail')
        console.log(text)
        this.setState({
            text
        })
    }   

    render() {
        let { text } = this.state
        return (
            <main className="page-bannerList" style={{padding: '0.3rem'}}>
                <div dangerouslySetInnerHTML={{ __html: text }}></div>
            </main>
        )
    }
}