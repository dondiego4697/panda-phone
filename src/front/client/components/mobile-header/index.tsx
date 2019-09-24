import * as React from 'react';
import {Link} from 'react-router-dom';

import bevis from 'libs/bevis';

import './index.scss';

const b = bevis('mobile-header');

interface IProps {
    budgeCount?: number;
}

export class MobileHeader extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <Link className={b('logo-link')} to='/'>
                        <div className={b('logo')}/>
                    </Link>
                    <div className={b('cart-button')}>
                        <Link
                            className={b('cart-button-link')}
                            to='/cart'
                        >
                            <div className={b('cart-button-icon')}/>
                        </Link>
                        {
                            (this.props.budgeCount || this.props.budgeCount === 0) &&
                            <div className={b('cart-budge')}>
                                <h1>{this.props.budgeCount}</h1>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}