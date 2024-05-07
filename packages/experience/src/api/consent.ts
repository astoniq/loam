import api from './api';
import {ConsentInfoResponse} from "@astoniq/loam-schemas";

export const consent = async () => {

    type Response = {
        redirectTo: string
    }

    return api.post('/api/interaction/consent').json<Response>()
}

export const getConsentInfo = async () => {
    return api.get('/api/interaction/consent').json<ConsentInfoResponse>()
}