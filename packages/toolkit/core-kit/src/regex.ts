export const emailRegEx = /^\S+@\S+\.\S+$/;
export const phoneRegEx = /^\d+$/;
export const phoneInputRegEx = /^\+?[\d-( )]+$/;
export const usernameRegEx = /^[A-Z_a-z]\w*$/;
export const webRedirectUriProtocolRegEx = /^https?:$/;
export const mobileUriSchemeProtocolRegEx = /^[a-z][\d+_a-z-]*(\.[\d+_a-z-]+)+:$/;
export const hexColorRegEx = /^#[\da-f]{3}([\da-f]{3})?$/i;
export const dateRegex = /^\d{4}(-\d{2}){2}/;
export const noSpaceRegEx = /^\S+$/;
export const isValidRegEx = (regEx?: string) => {
    try {
        return Boolean(regEx && new RegExp(regEx));
    } catch {
        return false;
    }
};