import {conditionalSql, convertToIdentifiers} from "@/utils/sql.js";
import {logEntity} from "@/entities/index.js";
import {hook, token, interaction, LogKeyUnknown, logGuard, countGuard} from '@astoniq/loam-schemas'
import {CommonQueryMethods, sql} from "slonik";
import {buildFindEntityByIdWithPool, buildInsertIntoWithPool} from "@/database/index.js";
import {conditional, conditionalArray} from "@astoniq/essentials";

const {table, fields} = convertToIdentifiers(logEntity)

export type AllowedKeyPrefix = hook.Type | token.Type | interaction.Prefix | typeof LogKeyUnknown

type LogCondition = {
    logKey?: string;
    payload?: { applicationId?: string, userId?: string, hookId?: string };
    startTimeExclusive?: number;
    includeKeyPrefix?: AllowedKeyPrefix[]
}

const buildLogConditionSql = (logCondition: LogCondition) =>
    conditionalSql(logCondition, ({logKey, payload, startTimeExclusive, includeKeyPrefix}) => {
        const keyPrefixFilter = conditional(
            includeKeyPrefix
            && includeKeyPrefix.length > 0
            && includeKeyPrefix.map((prefix) => sql.fragment`${fields.key} like ${`${prefix}%`}`)
        );
        const subConditions = [
            conditionalSql(
                keyPrefixFilter,
                (keyPrefixFilter) => sql.fragment`(${sql.join(keyPrefixFilter, sql.fragment` or `)})`
            ),
            ...conditionalArray(
                payload &&
                Object.entries(payload)
                    .map(([key, value]) => value
                        ? sql.fragment`${fields.payload}->>${key}=${value}` : sql.fragment``)
            ),
            conditionalSql(logKey, logKey => sql.fragment`${fields.key}=${logKey}`),
            conditionalSql(startTimeExclusive, startTimeExclusive =>
                sql.fragment`${fields.createdAt} > to_timestamp(${startTimeExclusive}::double precision / 1000)`)
        ]
            .filter(sql => sql)

        return subConditions.length > 0 ? sql.fragment`where ${sql.join(subConditions, sql.fragment` and `)}` : sql.fragment``
    })


export const createLogQueries = (pool: CommonQueryMethods) => {

    const insertLog = buildInsertIntoWithPool(pool)(logEntity, logGuard);

    const countLogs = async (condition: LogCondition) =>
        pool.one(sql.type(countGuard)`
            select count(*)
            from ${table} ${buildLogConditionSql(condition)}`);

    const findLogs = async (limit: number, offset: number, logCondition: LogCondition) =>
        pool.any(sql.type(logGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`,`)}
            from ${table} ${buildLogConditionSql(logCondition)}
            order by ${fields.createdAt} desc
            limit ${limit} offset ${offset}`);

    const findLogById = buildFindEntityByIdWithPool(pool)(logEntity, logGuard);

    return {
        insertLog,
        countLogs,
        findLogs,
        findLogById
    }
}