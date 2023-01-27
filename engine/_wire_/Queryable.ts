import { IndexedParamDescriptor } from "../models/IndexedParamDescriptor";

export interface Queryable {
    GetQueryParameters(action?: string): IndexedParamDescriptor[];
}