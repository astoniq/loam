import application from "./application";
import entity from "./entity";
import guard from "./guard";
import {Errors} from "@/types";

const errors: Errors = {
    application,
    guard,
    entity
};

export default Object.freeze(errors);