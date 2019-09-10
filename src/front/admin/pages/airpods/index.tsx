import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {Column} from 'material-table';
import Snackbar from '@material-ui/core/Snackbar';

import {ClientDataModel} from 'admin/models/client-data';
import {Airpods, AirpodsPageModel} from 'admin/models/airpods';
import ProgressBar from 'admin/components/progress-bar';
import Table from 'admin/components/table';
import TableTitle from 'admin/components/table-title';
import {PageStatus} from 'admin/libs/types';

import bevis from 'libs/bevis';

import './index.scss';

interface IProps {
    clientDataModel?: ClientDataModel;
    airpodsPageModel?: AirpodsPageModel;
}

const b = bevis('airpods');

@inject('clientDataModel', 'airpodsPageModel')
@observer
export class AirpodsPage extends React.Component<IProps> {
    public componentDidMount(): void {
        this.props.airpodsPageModel!.fetchData();
    }

    public render(): React.ReactNode {
        if (this.props.airpodsPageModel!.status === PageStatus.LOADING) {
            return <ProgressBar />;
        }

        const tableName = 'Airpods';
        return (
            <div className={b()}>
                <TableTitle value={tableName} />
                <div className={b('container')}>
                    <div className={b('table-container')}>
                        <Table
                            columns={this.getColumns()}
                            rows={this.getRows()}
                            rowsPerPage={this.props.airpodsPageModel!.limit}
                            currentPage={this.props.airpodsPageModel!.offset / this.props.airpodsPageModel!.limit + 1}
                            handleChangePage={this.handleChangePage}
                            handleChangeRowsPerPage={this.handleChangeRowsPerPage}
                            handleDeleteRow={this.handleDeleteRow}
                            handleUpdateRow={this.handleUpdateRow}
                            handleAddRow={this.handleAddRow}
                            options={{actionsColumnIndex: -1}}
                        />
                    </div>
                    <Snackbar
                        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                        key='top_center'
                        autoHideDuration={6000}
                        onClose={this.handleCloseSnackbar}
                        open={this.props.airpodsPageModel!.snackbar.open}
                        ContentProps={{'aria-describedby': 'message-id'}}
                        message={<span id='message-id'>{this.props.airpodsPageModel!.snackbar.message}</span>}
                    />
                </div>
            </div>
        );
    }

    private getColumns(): Column<Airpods>[] {
        return this.props.airpodsPageModel!.tableColumns;
    }

    private getRows(): Airpods[] {
        return this.props.airpodsPageModel!.data;
    }

    private handleChangePage = (diff: number): void => {
        this.props.airpodsPageModel!.offset += this.props.airpodsPageModel!.limit * diff;
        this.props.airpodsPageModel!.fetchData();
    }

    private handleChangeRowsPerPage = (rows: number): void => {
        this.props.airpodsPageModel!.limit = rows;
        this.props.airpodsPageModel!.offset = 0;
        this.props.airpodsPageModel!.fetchData();
    }

    private showSnackbar = (err: Error): void => {
        this.props.airpodsPageModel!.snackbar.message = err.message;
        this.props.airpodsPageModel!.snackbar.open = true;
    }

    private handleDeleteRow = (airpods: Airpods): Promise<void> => {
        return this.props.airpodsPageModel!.deleteRow(airpods).catch(this.showSnackbar);
    }

    private handleUpdateRow = (airpods: Airpods): Promise<void> => {
        return this.props.airpodsPageModel!.updateRow(airpods).catch(this.showSnackbar);
    }

    private handleAddRow = (airpods: Airpods): Promise<void> => {
        return this.props.airpodsPageModel!.insertRow(airpods).catch(this.showSnackbar);
    }

    private handleCloseSnackbar = (): void => {
        this.props.airpodsPageModel!.snackbar.open = false;
    }
}