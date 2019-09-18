import * as React from 'react';

import bevis from 'libs/bevis';

import './index.scss';

const b = bevis('iphone-mock');

interface IProps {
    model: string;
}

const imageDefault = 'x_space_gray';

const imageDefaults = new Map([
    ['6s', '6s_space_gray'],
    ['7', '7_black_jet'],
    ['8', '8_space_gray'],
    ['se', 'se_space_gray'],
    ['x', 'x_space_gray'],
    ['xr', 'xr_space_gray'],
    ['xs', 'xs_space_gray']
]);

const imageSet = new Set([
    '6s_gold',
    '6s_rose_gold',
    '6s_silver',
    '6s_space_gray',
    '7_black_jet',
    '7_black_matte',
    '7_gold',
    '7_plus_black_jet',
    '7_plus_black_matte',
    '7_plus_gold',
    '7_plus_rose_gold',
    '7_plus_silver',
    '7_rose_gold',
    '7_silver',
    '8_gold',
    '8_plus_gold',
    '8_plus_silver',
    '8_plus_space_gray',
    '8_silver',
    '8_space_gray',
    'se_gold',
    'se_rose_gold',
    'se_space_gray',
    'x_silver',
    'x_space_gray',
    'xr_blue',
    'xr_coral',
    'xr_red',
    'xr_silver',
    'xr_space_gray',
    'xr_yellow',
    'xs_gold',
    'xs_max_gold',
    'xs_max_silver',
    'xs_max_space_gray',
    'xs_silver',
    'xs_space_gray'
]);

function createImageName(model: string): string {
    const name = model.toLowerCase().split(' ').join('_');
    if (imageSet.has(name)) {
        return name;
    }

    const prefix = name.split('_')[0];
    if (imageDefaults.has(prefix)) {
        return imageDefaults.get(prefix)!;
    }

    return imageDefault;
}

export class IphoneMock extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('image-wrapper')}>
                    <div className={b('phone')}>
                        <img
                            className={b('phone-frame')}
                            src={`/public/imgs/iphone-mock/${createImageName(this.props.model)}.png`}
                        />
                        <div className={`${b('phone-bg')} ${Math.random() > 0.5 ? 'bg-1' : 'bg-2'}`} />
                    </div>
                </div>
            </div>
        );
    }
}