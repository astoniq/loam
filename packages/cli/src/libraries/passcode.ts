import {customAlphabet, nanoid} from 'nanoid';
import {Queries} from "@/application/queries.js";
import {TemplateType} from "@astoniq/loam-connector-kit";
import {RequestError} from "@/errors/index.js";

export const passcodeLength = 6;
const randomCode = customAlphabet('1234567890', passcodeLength);

export const passcodeExpiration = 10 * 60 * 1000; // 10 minutes.
export const passcodeMaxTryCount = 10;

export type PasscodeLibrary = ReturnType<typeof createPasscodeLibrary>;

export const createPasscodeLibrary = (queries: Queries) => {

    const {
        consumePasscode,
        deletePasscodesByIds,
        findUnconsumedPasscodeByJtiAndType,
        findUnconsumedPasscodesByJtiAndType,
        findUnconsumedPasscodeByIdentifierAndType,
        findUnconsumedPasscodesByIdentifierAndType,
        increasePasscodeTryCount,
        insertPasscode,
    } = queries.passcode;

    const createPasscode = async (
        jti: string | undefined,
        type: TemplateType,
        payload: { email: string }
    ) => {
        // Disable existing passcodes.
        const passcodes = jti
            ? await findUnconsumedPasscodesByJtiAndType(jti, type)
            : await findUnconsumedPasscodesByIdentifierAndType({type, ...payload});

        if (passcodes.length > 0) {
            await deletePasscodesByIds(passcodes.map(({id}) => id));
        }

        return insertPasscode({
            id: nanoid(),
            interactionJti: jti,
            type,
            code: randomCode(),
            ...payload,
        });
    };

    const verifyPasscode = async (
        jti: string | undefined,
        type: TemplateType,
        code: string,
        payload:  { email: string }
    ): Promise<void> => {
        const passcode = jti
            ? // Session based flows. E.g. SignIn, Register, etc.
            await findUnconsumedPasscodeByJtiAndType(jti, type)
            : // Generic flow. E.g. Triggered by management API
            await findUnconsumedPasscodeByIdentifierAndType({ type, ...payload });

        if (!passcode) {
            throw new RequestError('verification_code.not_found');
        }

        if ('email' in payload && passcode.email !== payload.email) {
            throw new RequestError('verification_code.email_mismatch');
        }

        if (passcode.createdAt + passcodeExpiration < Date.now()) {
            throw new RequestError('verification_code.expired');
        }

        if (passcode.tryCount >= passcodeMaxTryCount) {
            throw new RequestError('verification_code.exceed_max_try');
        }

        if (code !== passcode.code) {
            await increasePasscodeTryCount(passcode.id);
            throw new RequestError('verification_code.code_mismatch');
        }

        await consumePasscode(passcode.id);
    };

    return {
        createPasscode,
        verifyPasscode
    }
}