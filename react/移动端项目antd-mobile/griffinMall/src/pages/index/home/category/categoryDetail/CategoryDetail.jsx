import React from 'react'
import { withRouter } from 'react-router-dom';
import GoodsList from 'components/goodsList/GoodsList'
import './CategoryDetail.less'
import { goPage, Axios, parseQueryString } from 'util/util'
import Constant from 'util/Constant'
class CategoryDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            type: 0,
            index: 0,
            subCategoryId: '',
            tab: [{ name: '全部', type: 0 }, { name: '销量', type: 1 }, { name: '价格', type: 2 }]
        }
    }
    componentWillMount() {
        var options = parseQueryString(this.props.location.pathname + this.props.location.search)
        var goodsCategory = localStorage.getItem('goodsCategory')
        if (goodsCategory) {
            localStorage.removeItem('goodsCategory')
            goodsCategory = JSON.parse(goodsCategory)
            this.setState({
                subCategoryId: goodsCategory.subCategoryId,
                type: goodsCategory.sortRule,
                index: goodsCategory.index
            })
        }else if (options.id) {
            this.setState({
                subCategoryId: options.id,
            })
        }
    }

    render() {
        let { tab, type, index } = this.state
        return (
            <main className="categoryDetail-page">
                <div className="top-tab flex-between">
                    {tab.map((x, i) => (
                        <div className={["tab-item flex-middle", index === i ? 'act' : ''].join(' ')} key={i} onClick={() => {
                            if (i == 2) {
                                x.type = x.type == 2 ? 3 : 2
                            }
                            this.setState({
                                type: x.type,
                                index: i
                            })
                        }}>
                            <span>{x.name}</span>
                            {/* {x.type === 2 ? <img src={require('common/img/sort_t.png')} /> : null} */}
                            {(x.type === 2 || x.type === 3) && (type === 2 || type === 3) ? <img src={type == 2 ? require('common/img/sort_t.png') : require('common/img/sort_b.png')} /> : null}
                        </div>
                    ))}
                </div>
                <GoodsList
                    loadUrl='/goodsTemplate/sub/category/list'
                    json={{
                        storesId: Constant.data.storesId,
                        subCategoryId: this.state.subCategoryId,
                        sortRule: this.state.type,  // 排序规则, 0:默认 1:销量 2:价格正序 3:价格倒序
                    }}
                    goDetailCallback={() => {
                        if (this.state.type) {
                            localStorage.setItem('goodsCategory', JSON.stringify({
                                subCategoryId: this.state.subCategoryId,
                                index:index,
                                sortRule: this.state.type,  // 排序规则, 0:默认 1:销量 2:价格正序 3:价格倒序
                            }))
                        }
                    }}
                />
            </main >
        )
    }
}
export default withRouter(CategoryDetail)