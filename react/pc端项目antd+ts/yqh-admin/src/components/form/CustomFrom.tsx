import * as React from 'react';

export interface ICustomFormProps {
  [propName: string]: any
}

export interface ICustomFormState {
  [propName: string]: any
}

export default class CustomForm extends React.Component<ICustomFormProps, ICustomFormState> {
  constructor(props: ICustomFormProps) {
    super(props);

    this.state = {
    }
  }

  public render() {
    return (
      <div>
        11
      </div>
    );
  }
}
