import { IndexedParamDescriptor } from "../models/IndexedParamDescriptor";

export interface Routable {
    GetRouteParameters(action?: string): IndexedParamDescriptor[];
}