import * as React from 'react';
import Contain from './components/Contain'
import Left from './components/Left'
import Right from './components/Right'
import './components/all.less'
export interface IAppProps {
}

export interface IAppState {
}

export default class App extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {
    }
  }

  public render() {
    return (
      <div className="App">
        <Left />
        <Contain />
        <Right />
      </div>
    );
  }
}
