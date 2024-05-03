import {Theme} from "@astoniq/loam-schemas";
import {Platform, SignInExperienceSettings} from "../../types";
import {createContext} from "react";
import {isMobile} from 'react-device-detect';

export type PageContextType = {
    theme: Theme
    loading: boolean;
    platform: Platform
    experienceSettings: SignInExperienceSettings | undefined
}

export default createContext<PageContextType>({
    loading: false,
    platform: isMobile ? 'mobile' : 'web',
    theme: Theme.Light,
    experienceSettings: undefined
})