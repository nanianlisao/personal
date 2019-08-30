import React from 'react'
import "pages/index/quanzi/search/QuanziSearch.less"
import QuanziList from 'components/quanziList/QuanziList'
import { SearchBar } from 'antd-mobile';
export default class QuanziSearch extends React.Component {
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
            <main className="quanziSearch-page">
                <div>
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
                </div>
                {showList ? <QuanziList
                    loadUrl='/circle/list'
                    json={{
                        body: searchName
                    }}
                /> : ""}
            </main >
        )
    }
}