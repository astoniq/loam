export type Entity<
    Key extends string,
    Table extends string = string,
    TableSingular extends string = string
> = Readonly<{
    table: Table;
    tableSingular: TableSingular;
    fields: {
        [key in Key]: string;
    };
    fieldKeys: readonly Key[];
}>