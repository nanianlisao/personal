import React from 'react'
import { SectionsContainer, Section, Header, ScrollToTopOnMount } from 'react-fullpage';

const navBar = [{ name: '首页', href: 'index' }, { name: '关于我', href: 'about' }, { name: '技术栈', href: 'technology' }, { name: '项目经验', href: 'project' }, { name: '其他', href: 'work' },]
export default class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            close: true,
            blockFlag: true,
            sectionIndex: 0,
            cirleList: [
                {
                    name: 'react'
                }, {
                    name: '小程序'
                }, {
                    name: 'vue'
                }, {
                    name: 'es6'
                },
                // {
                //     name: 'es6'
                // },{
                //     name: 'es6'
                // },{
                //     name: 'es6'
                // },
                {
                    name: 'css3'
                }, {
                    name: 'renative'
                }
            ],
            blockList: [
                {
                    poster: require('common/img/about.jpg'),
                    title: '这是标题内容',
                    content:'这是标题内容这是标题内容这是标题内容这是标题内容这是标题内容这是标题内容这是标题内容这是标题内容这是标题内容'
                },
                {
                    poster: require('common/img/about.jpg'),
                    title: '这是标题内容',
                    content:'这是标题内容这是标题内容这是标题内容这是标题内容这是标题内容这是标题内容这是标题内容这是标题内容这是标题内容'
                },
                {
                    poster: require('common/img/about.jpg'),
                    title: '这是标题内容',
                    content:'这是标题内容这是标题内容这是标题内容这是标题内容这是标题内容这是标题内容这是标题内容这是标题内容这是标题内容'
                },
                {
                    poster: require('common/img/about.jpg'),
                    title: '这是标题内容',
                    content:'这是标题内容这是标题内容这是标题内容这是标题内容这是标题内容这是标题内容这是标题内容这是标题内容这是标题内容'
                },
            ]
        }
    }
    componentDidMount() {
        // setTimeout(()=>{
        //     this.setState({
        //         close: false
        //     })
        // })

    }
    render() {
        let { sectionIndex, cirleList, close, blockFlag, blockList } = this.state
        return (
            <main className="index-main">
                <ScrollToTopOnMount />
                <Header>
                    <ul className="navBar">
                        {navBar.map((item, index) => {
                            return (
                                <li key={index}><a href={"#" + item.href} className={sectionIndex === index ? 'active' : ''}>{item.name}</a></li>
                            )
                        })}
                    </ul>
                </Header>

                <SectionsContainer
                    activeSection={sectionIndex}
                    anchors={['index', 'about', 'technology', 'project', 'work']} // the anchors for each sections
                    arrowNavigation={true} // use arrow keys
                    scrollCallback={(e) => {
                        var sectionIndex = e.activeSection
                        var obj = { sectionIndex: sectionIndex }
                        if (sectionIndex == 2) {
                            obj.close = false
                        } else if (!this.state.close) {
                            obj.close = true
                        }

                        if (sectionIndex == 3) {
                            obj.blockFlag = false
                        } else if (!this.state.blockFlag) {
                            obj.blockFlag = true
                        }
                        this.setState(obj)
                    }}
                    delay={500} // the scroll animation speed
                    navigation={false} // use dots navigatio
                >
                    <Section>
                        <div className="section-one">
                            <div className="sky">
                                <div className="sky-bg sky-bg1" style={{ backgroundImage: 'url(' + require('common/img/cloud_one.png') + ')' }}></div>
                                <div className="sky-bg sky-bg2" style={{ backgroundImage: 'url(' + require('common/img/cloud_two.png') + ')' }}></div>
                                <div className="sky-bg sky-bg3" style={{ backgroundImage: 'url(' + require('common/img/cloud_three.png') + ')' }}></div>
                            </div>
                            <div className="content">
                                <div className="content-title">一个<span>自己</span>的网站</div>
                                <div className="content-remark">喜欢技术，热爱挑战</div>
                            </div>
                        </div>
                    </Section>
                    <Section>
                        <div className="section-two">
                            <div className="book">
                                <div className="imgBox">
                                    <div className="dark"></div>
                                    <img src={require('common/img/about.jpg')} alt="" />
                                </div>
                                <div className="detail">
                                    <h4 className="title1">关于我 </h4>
                                    <h4 className="title2">(一名前端开发工程师)</h4>
                                    <p>学历：本科</p>
                                    <p>年龄：24周岁</p>
                                    <p>坐标：江苏-南京</p>
                                    <p>状态：目前在职</p>
                                    <p>俩年全职前端开发经验</p>
                                    <p>熟悉MVVM、前端自动化、模块化</p>
                                    <p>高效的自学能力</p>
                                    <p>具备独立分析解决问题能力</p>
                                    <p>希望能加入一个大牛多、战斗力强的团队</p>
                                    <p className="sign">陈翔</p>
                                </div>
                            </div>
                        </div>
                    </Section>
                    <Section>
                        <div className="section-three">
                            <div className="cirle">
                                <div className="title" onClick={() => {
                                    this.setState({
                                        close: !this.state.close
                                    })
                                }}>
                                    <span>技术栈</span>
                                </div>
                                <ul className={["cirle-list", close ? 'close' : ''].join(' ')}>
                                    {cirleList.map((item, index) => {
                                        let deg = 360 / cirleList.length * index - 15
                                        let timer = index * 0.02
                                        return (
                                            <li className="cirle-item" key={index} style={{ transform: 'rotate(' + deg + 'deg)', transitionDelay: timer + 's' }}>
                                                <span style={{ transform: 'rotate(' + -deg + 'deg)' }}>{item.name}</span>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                    </Section>
                    <Section>
                        <div className="section-four">
                            <div className="block">
                                <ul>
                                    {blockList.map((x, index) => {
                                        return (
                                            <li className={["wrapper", blockFlag ? "blockFlag" : ""].join(" ")} key={index}>
                                                <div className="poster">
                                                    <img src={x.poster} alt="" />
                                                </div>
                                                <div className="box">
                                                    <h3>{x.title}</h3>
                                                    <div>{x.content}</div>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                    </Section>
                    <Section>Page 5</Section>
                </SectionsContainer>
            </main >
        )
    }
}