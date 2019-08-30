import React from 'react'
import { goPage } from 'util/util'

let lettersArr = [{ code: 'A', keyCode: 65 }, { code: 'B', keyCode: 66 }, { code: 'C', keyCode: 67 }, { code: 'D', keyCode: 68 }, { code: 'E', keyCode: 69 },
{ code: 'F', keyCode: 70 }, { code: 'G', keyCode: 71 }, { code: 'H', keyCode: 72 }, { code: 'I', keyCode: 73 }, { code: 'J', keyCode: 74 }, { code: 'K', keyCode: 75 },
{ code: 'L', keyCode: 76 }, { code: 'M', keyCode: 77 }, { code: 'N', keyCode: 78 }, { code: 'O', keyCode: 79 }, { code: 'P', keyCode: 80 }, { code: 'Q', keyCode: 81 },
{ code: 'R', keyCode: 82 }, { code: 'S', keyCode: 83 }, { code: 'T', keyCode: 84 }, { code: 'U', keyCode: 85 }, { code: 'V', keyCode: 86 }, { code: 'W', keyCode: 87 },
{ code: 'X', keyCode: 88 }, { code: 'Y', keyCode: 89 }, { code: 'Z', keyCode: 90 }]
export default class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            error: false,
            letter: null,
            remark: '请在按键上按下屏幕上显示的字母',
            shake: false,
        }
    }
    componentDidMount() {
        var random = parseInt(Math.random() * lettersArr.length)
        this.setState({
            letter: lettersArr[random]
        })

        document.addEventListener('keydown', this.keydown, false);

    }

    keydown = (ev) => {
        if (ev.keyCode === this.state.letter.keyCode) {
            goPage('/index')
        } else {
            this.setState({
                remark: '输入有误,请重新输入',
                error: true,
                shake: true,
            })
            setTimeout(() => {
                this.setState({
                    shake: false,
                })
            }, 1000)
            this.rendomLetter()
        }
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.keydown, false)
    }

    rendomLetter() {
        var random = parseInt(Math.random() * lettersArr.length)
        this.setState({
            letter: lettersArr[random]
        })
    }

    render() {
        let { error, remark, letter, shake } = this.state;
        return (
            <main className="login-main">
                <div className={["letter", error ? "error" : "", shake ? "shake" : ""].join(" ")}>{letter && letter.code}</div>
                <div className="remark">{remark}</div>
            </main>
        )
    }
}