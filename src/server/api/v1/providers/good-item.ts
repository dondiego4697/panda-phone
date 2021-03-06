import {PoolClient} from 'pg';

import {makeRequest} from 'server/db/client';
import {
    seizePaginationParams,
    makeInsertParams,
    makeInsertText,
    makeUpdateText,
    makeWhereParams,
    makeDeleteText
} from 'server/lib/db';
import {makeTransactionRequest} from 'server/db/client';
import {GoodItemValidatorRequest} from 'server/api/v1/validators/good-item';
import {IGetGoodItemsResponse} from 'common/types';
import {IGoodItemDbModel} from 'common/models/good-item';

const TABLE_NAME = 'good_item';

export class GoodItemProvider {
    static async getGoodItems(query: Record<string, any>): Promise<IGetGoodItemsResponse> {
        const {limit, offset} = seizePaginationParams(query);
        const searchTagValues: string[] = [];

        if (query.search_tags) {
            searchTagValues.push(...query.search_tags.split(','));
            delete query.search_tags;
        }

        const {pairs, values} = makeWhereParams(query);
        if (searchTagValues.length > 0) {
            pairs.push(`
                (
                    ${searchTagValues.map((tag) => {
                        values.push(tag);
                        return `$${values.length} = ANY (search_tags)`;
                    }).join(' OR ')}
                )`
            );
        }

        const whereText = `${values.length === 0 ? '' : `WHERE ${pairs.join(' AND ')}`}`;
        const [{rows: [total]}, {rows}] = await Promise.all([
            makeRequest({
                text: `SELECT COUNT(*) FROM ${TABLE_NAME} ${whereText};`,
                values: values
            }),
            makeRequest({
                text: `
                    SELECT * FROM ${TABLE_NAME} ${whereText}
                    ORDER BY updated DESC
                    LIMIT ${limit} OFFSET ${offset};
                `,
                values
            })
        ]);

        return {total: Number(total.count), rows};
    }

    static async getGoodItem(id: string): Promise<IGoodItemDbModel> {
        const {rows} = await makeRequest({
            text: `SELECT * FROM ${TABLE_NAME} WHERE id=$1;`,
            values: [id]
        });

        return rows[0];
    }

    static async createGoodItem(client: PoolClient, rawBody: Record<string, any>): Promise<IGoodItemDbModel> {
        const body = GoodItemValidatorRequest.validateGoodItemCreate(rawBody);
        const {fields, values} = makeInsertParams(body);
        const text = makeInsertText(TABLE_NAME, fields);
        const {rows} = await makeTransactionRequest(client, {text, values});
        return rows[0];
    }

    static async updateGoodItem(
        client: PoolClient,
        id: string,
        rawBody: Record<string, any>
    ): Promise<IGoodItemDbModel> {
        const body = GoodItemValidatorRequest.validateGoodItemUpdate(rawBody);
        const {fields, values} = makeInsertParams(body);
        const text = makeUpdateText(TABLE_NAME, fields);
        const {rows} = await makeTransactionRequest(client, {
            text,
            values: [id, ...values]
        });

        return rows[0];
    }

    static async deleteGoodItem(client: PoolClient, id: string): Promise<IGoodItemDbModel> {
        const text = makeDeleteText(TABLE_NAME);
        const {rows} = await makeTransactionRequest(client, {text, values: [id]});
        return rows[0];
    }
}
