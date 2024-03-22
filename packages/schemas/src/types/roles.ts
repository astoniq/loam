export enum RoleType {
    User = 'User',
    MachineToMachine = 'MachineToMachine',
}

export type CreateRole = {
    tenantId?: string;
    id: string;
    name: string;
    description: string;
    type?: RoleType;
};


export type Role = {
    tenantId: string;
    id: string;
    name: string;
    description: string;
    type: RoleType;
};