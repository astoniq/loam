import application from "./application.js";
import entity from "./entity.js";
import guard from "./guard.js";
import {Errors} from "@/types.js";

const errors: Errors = {
    application,
    guard,
    entity
};

export default Object.freeze(errors);