import { ParamDescriptor } from "../models/ParamDescriptor";

export interface Postable {
    GetBodyParameters(action?: string): ParamDescriptor[];
}