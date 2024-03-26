export enum RoleType {
    User = 'User',
    MachineToMachine = 'MachineToMachine',
}

export type CreateRole = {
    id: string;
    name: string;
    description: string;
    type?: RoleType;
};


export type Role = {
    id: string;
    name: string;
    description: string;
    type: RoleType;
};