import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
class Board extends React.Component {
    renderSquare(i) {
        return <Square value = { this.props.square[i] } onClick = {
            () => this.props.onClick(i)
        }
        />;
    }
    render() {
        return ( <
            div >
            <
            div className = "board-row" > { this.renderSquare(0) } { this.renderSquare(1) } { this.renderSquare(2) } <
            /div> <
            div className = "board-row" > { this.renderSquare(3) } { this.renderSquare(4) } { this.renderSquare(5) } <
            /div> <
            div className = "board-row" > { this.renderSquare(6) } { this.renderSquare(7) } { this.renderSquare(8) } <
            /div> < /
            div >
        );
    }
}

class Game extends React.Component {
    constructor() {
        super()
        this.state = {
            history: [{
                square: Array(9).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true
        }
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const square = current.square.slice();
        if (square[i] || checkWinner(square)) return
        square[i] = this.state.xIsNext ? 'X' : 'O'
        this.setState({
            history: [...history, { square }],
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        })
    }
    jumpTo(index) {
        this.setState({
            stepNumber: index,
            xIsNext: (index % 2) ? false : true,
        })
    }
    render() {
        const { history } = this.state
        const current = history[this.state.stepNumber]
        const winner = checkWinner(current.square)
        const moves = history.map((item, index) => {
            const desc = index ? `Move #${index}` : 'Game Start'
            return ( <
                li key = { index } >
                <
                a href = "#"
                onClick = {
                    () => this.jumpTo(index)
                } > { desc } < /a> < /
                li >
            )
        })
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return ( <
            div className = "game" >
            <
            div className = "game-board" >
            <
            Board onClick = {
                (i) => this.handleClick(i)
            }
            square = { current.square }
            / > < /
            div > <
            div className = "game-info" >
            <
            div > { status } < /div> <
            ol > { moves } < /ol> < /
            div > <
            /div>
        );
    }
}

function Square(props) {
    return ( <
        button className = "square"
        onClick = {
            () => { props.onClick() }
        } > { props.value } <
        /button>
    );
}

function checkWinner(square) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i]
        if (square[a] && 　square[a] === square[b] && square[a] === square[c]) {
            return square[a]
        }
    }
    return false
}
// ========================================

ReactDOM.render( <
    Game / > ,
    document.getElementById('root')
);