import application from "./application";
import guard from "./guard";
import {Errors} from "@/types";

const errors: Errors = {
    application,
    guard
};

export default Object.freeze(errors);