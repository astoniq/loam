import type Provider from "oidc-provider";
import {Queries} from "@/context/queries.js";
import {Libraries} from "@/context/libraries.js";

export interface LoamContext {
    queries: Queries;
    libraries: Libraries
    provider: Provider;
}