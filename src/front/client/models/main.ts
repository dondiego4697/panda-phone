import {observable, action, runInAction} from 'mobx';

import {PageStatus} from 'libs/types';
import {getBarItems} from 'client/libs/request';
import {ClientCookie} from 'client/libs/cookie';

export interface IAirpod {
    id: string;
    series: string;
    original: boolean;
    charging: boolean;
    price: number;
    discount: number;
}

export interface IIphone {
    id: string;
    model: string;
    color: string;
    memory: string;
    price: number;
    discount: number;
}

export interface IBarItems {
    airpods: IAirpod[];
    iphones: IIphone[];
}

export class MainPageModel {
    @observable public status = PageStatus.LOADING;
    @observable public barItems: IBarItems | undefined;
    @observable public cartCount = 0;
    @observable public showAddedToCartPopup = false;

    @action public fetchData(): void {
        runInAction(() => {
            this.status = PageStatus.LOADING;
            getBarItems().then((barItems) => {
                this.barItems = barItems;
                this.status = PageStatus.DONE;

                this.calcCart();
            });
        });
    }

    @action public calcCart(): void {
        const iphonesIds = ClientCookie.getCartIds('iphone');
        const airpodsIds = ClientCookie.getCartIds('airpod');

        const useAirpodsIds: string[] = airpodsIds.filter(
            (id) => this.barItems!.airpods.find((airpod) => airpod.id === id)
        ) as string[];

        const useIphonesIds: string[] = iphonesIds.filter(
            (id) => this.barItems!.iphones.find((iphone) => iphone.id === id)
        ) as string[];

        ClientCookie.clearCart();
        useAirpodsIds.forEach((id) => ClientCookie.addIdInCart('airpod', id));
        useIphonesIds.forEach((id) => ClientCookie.addIdInCart('iphone', id));

        this.cartCount = useAirpodsIds.length + useIphonesIds.length;
    }
}
