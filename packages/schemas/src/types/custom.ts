export enum ApplicationType {
    Native = 'Native',
    SPA = 'SPA',
    Traditional = 'Traditional',
    MachineToMachine = 'MachineToMachine',
    Protected = 'Protected',
}
export enum RoleType {
    User = 'User',
    MachineToMachine = 'MachineToMachine',
}
export enum SentinelActionResult {
    Success = 'Success',
    Failed = 'Failed',
}
export enum SentinelDecision {
    Undecided = 'Undecided',
    Allowed = 'Allowed',
    Blocked = 'Blocked',
    Challenge = 'Challenge',
}
export enum SignInMode {
    SignIn = 'SignIn',
    Register = 'Register',
    SignInAndRegister = 'SignInAndRegister',
}
export enum UsersPasswordEncryptionMethod {
    Argon2i = 'Argon2i',
}