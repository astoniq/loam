export const getAvailableMigrations = async (

) => {
    return []
}

export const checkMigrationState = async () =>  {
    const migrations = await getAvailableMigrations()

    if (migrations.length === 0) {
        return;
    }

    throw new Error('Undeployed database migration found.')
}