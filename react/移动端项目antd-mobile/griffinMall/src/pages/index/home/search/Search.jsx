import React from 'react'
import GoodsList from 'components/goodsList/GoodsList'
import { SearchBar } from 'antd-mobile';
import './Search.less'
import Constant from 'util/Constant'
export default class search extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            search: "",
            searchName: "",
            showList: false
        }
    }
    componentDidMount() {

    }
    render() {
        let { search, showList, searchName } = this.state
        return (
            <main className="search-page">
                <div className="search-wrap flex-between">
                    <SearchBar
                        className="search-bar"
                        value={search}
                        onChange={(e) => {
                            this.setState({
                                search: e
                            })
                        }}
                        onSubmit={(e) => {
                            this.setState({
                                showList: true,
                                searchName: search
                            })
                        }}
                        placeholder="搜索" maxLength={15}
                        showCancelButton={false}
                        clearTextOnFocus={false}
                        cancelText=" "
                    />
                    <div className="search-btn" onClick={()=>{
                        this.setState({
                            showList: true,
                            searchName: search
                        })
                    }}>搜索</div>
                </div>
                {showList ? <GoodsList
                    loadUrl='/goodsTemplate/sub/category/list'
                    json={{
                        goodsTemplateName: searchName,
                        storesId: Constant.data.storesId
                    }}
                /> : ""}
            </main >
        )
    }
}