import application from "./application.js";
import entity from "./entity.js";
import guard from "./guard.js";
import auth from "./auth.js";
import {Errors} from "@/types.js";

const errors: Errors = {
    application,
    guard,
    auth,
    entity
};

export default Object.freeze(errors);