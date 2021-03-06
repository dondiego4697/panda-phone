import * as React from 'react';
import {Switch, Route} from 'react-router-dom';
import {inject} from 'mobx-react';

import {ClientDataModel} from 'client/models/client-data';
import App from 'client/pages/app';

import {MainPage} from 'client/pages/main';
import {CartPage} from 'client/pages/cart';
import {NotFoundPage} from 'client/pages/not-fount';

interface IProps {
    clientDataModel?: ClientDataModel;
}

@inject('clientDataModel')
export class RoutesApp extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <App>
                {this.renderRouter()}
            </App>
        );
    }

    private renderRouter(): React.ReactNode {
        return (
            <Switch>
                <Route exact path='/' component={MainPage} />
                <Route exact path='/cart' component={CartPage} />
                <Route component={NotFoundPage} />
            </Switch>
        );
    }
}
