import * as React from 'react';

import bevis from 'libs/bevis';

import './index.scss';

const b = bevis('progress-bar');

export class ProgressBar extends React.Component<{}> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <div className={b('logo')}/>
                </div>
            </div>
        );
    }
}