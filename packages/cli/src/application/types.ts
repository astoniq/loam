import type Provider from "oidc-provider";
import {Queries} from "@/application/queries.js";
import {Libraries} from "@/application/libraries.js";

export interface ApplicationContext {
    queries: Queries;
    libraries: Libraries
    provider: Provider;
}