import { Indexable } from "./_wire_/Indexable";
import { Postable } from "./_wire_/Postable";
import { Queryable } from "./_wire_/Queryable";
import { Requestable } from "./_wire_/Requestable";
import { Routable } from "./_wire_/Routable";
import { Request, Response } from 'express';
import { IncomingHttpHeaders } from 'http2';

// Engine Type Aggregation
type AbstractController = Queryable & Routable & Requestable & Indexable;
type GetController = AbstractController;
type PostController = AbstractController & Postable;

// The type to use with your custom api controllers
export type EngineController = GetController & PostController;

export interface Controller extends EngineController {};

export class Controller {
    
    private request?: Request;
    private response?: Response;

    public get Request(): Request {
        if (this.request) {
            return this.request;
        }
        throw new Error('No current request.');
    }

    public get Response(): Response {
        if (this.response) {
            return this.response;
        }
        throw new Error('No current response.');
    }

    public get RequestHeaders(): IncomingHttpHeaders {
        if (this.request) {
            return this.request.headers;
        }
        
        throw new Error('A request does not exist.');
    }

    public SetResponseHeader(key: string, value: string): Controller {
        if (this.response) {
            this.response.set(key, value);
            return this;
        }

        throw new Error('No response to set headers on.');
    }

    public SetRequestState(action: string, request: Request, response: Response): { Params: any[] } {
        this.request = request;
        this.response = response;
        
        return {
            Params: this.getParams(action)
        }
    }

    public get HasPostRequests(): boolean {
        return this.PostRequests !== undefined;
    }

    public get HasGetRequests(): boolean {
        return this.GetRequests !== undefined;
    }
    
    protected Pipe(destination: NodeJS.WritableStream, options?: { end?: boolean | undefined; } | undefined): NodeJS.WritableStream {
        if (this.request) {
            return this.request.pipe(destination, options);
        }

        throw new Error('No request to pipe.');
    }

    protected Write(chunk: any, callback?: ((error: Error | null | undefined) => void) | undefined): boolean {
        if (this.response) {
            return this.response.write(chunk, callback);
        }

        throw new Error('No response to write to.');
    }

    private getParams(action: string): any[] {
        const queryParamMetadata = this.GetQueryParameters ? this.GetQueryParameters(action) : [];
        const routeParamMetadata = this.GetRouteParameters ? this.GetRouteParameters(action) : [];
        const bodyParamMetadata = this.GetBodyParameters ? this.GetBodyParameters(action) : [];

        const paramsLength = queryParamMetadata.length + routeParamMetadata.length + bodyParamMetadata.length;

        const params: any[] = Array.apply(null, Array(paramsLength)).map(function () {});
        for (const description of queryParamMetadata) {
            params[description.ParamIndex] = this.request?.query[description.Key];
        }
        for (const description of routeParamMetadata) {
            params[description.ParamIndex] = this.request?.params[description.Key];
        }
        for (const description of bodyParamMetadata) {
            params[description.ParamIndex] = this.request?.body;
        }

        return params;
    }
}