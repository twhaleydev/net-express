import { UrlDescriptor } from "../models/UrlDescriptor";

export interface Requestable {
    GetRequests(): UrlDescriptor[];
    PostRequests(): UrlDescriptor[];
}