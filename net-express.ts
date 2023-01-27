import express from "express";

import { Request, ParamsDictionary, Response, IRouterMatcher, RequestParamHandler, Locals, ApplicationRequestHandler, Application, IRoute, PathParams } from "express-serve-static-core";
import { Server } from "http";
import { ParsedQs } from "qs";
import { Controller } from "./engine/controller";

export interface NetExpress extends express.Express {
    controllers: Controller[];
}
export class NetExpress {
    
    private readonly server: express.Express;

    private get generic(): any {
        return this.server;
    }

    static Init(server: express.Express, ...controllers: Controller[]): NetExpress {
        const e = new NetExpress(server);
        e.controllers = controllers;

        return e;
    }

    constructor(server: express.Express) {
        this.server = server;
    }

    get request(): Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>> {
        return this.server.request;
    }

    get response(): Response<any, Record<string, any>, number> {
        return this.server.response;
    }

    init(): void {
        this.server.init();
    }

    defaultConfiguration(): void {
        this.server.defaultConfiguration();
    }

    engine(ext: string, fn: (path: string, options: object, callback: (e: any, rendered?: string | undefined) => void) => void): this {
        this.server.engine(ext, fn);
        return this;
    }

    set(setting: string, val: any): this {
        this.server.set(setting, val);
        return this;
    }

    get get(): ((name: string) => any) & IRouterMatcher<this, any> {
        return this.server.get as ((name: string) => any) & IRouterMatcher<this, any>;
    }

    param(name: string | string[], handler: RequestParamHandler): this;
    param(callback: (name: string, matcher: RegExp) => RequestParamHandler): this;
    param(name: unknown, handler?: unknown): this {
        this.generic.param(name, handler);
        return this;
    }

    path(): string {
        return this.server.path();
    }

    enabled(setting: string): boolean {
        return this.server.enabled(setting);
    }

    disabled(setting: string): boolean {
        return this.server.disabled(setting);
    }

    enable(setting: string): this {
        this.server.enable(setting);
        return this;
    }

    disable(setting: string): this {
        this.server.disable(setting);
        return this;
    }

    render(name: string, options?: object | undefined, callback?: ((err: Error, html: string) => void) | undefined): void;
    render(name: string, callback: (err: Error, html: string) => void): void;
    render(name: unknown, options?: unknown, callback?: unknown): void {
        this.generic.render(name, options, callback);
    }

    listen(port: number, hostname: string, backlog: number, callback?: (() => void) | undefined): Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
    listen(port: number, hostname: string, callback?: (() => void) | undefined): Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
    listen(port: number, callback?: (() => void) | undefined): Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
    listen(callback?: (() => void) | undefined): Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
    listen(path: string, callback?: (() => void) | undefined): Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
    listen(handle: any, listeningListener?: (() => void) | undefined): Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
    listen(port?: unknown, hostname?: unknown, backlog?: unknown, callback?: unknown): import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse> {
        return this.generic.listen(port, hostname, backlog, () => {
            for (const controller of this.controllers) {
                if (controller.HasGetRequests) {
                    for (const getRequest of controller.GetRequests()) {
                        this.server.get(getRequest.Route, (req: Request, res: Response) => {
        
                            const state = controller.SetRequestState(getRequest.Action, req, res);
                            const controllerAction = controller[getRequest.Action](...state.Params);
        
                            Promise.resolve(controllerAction).then(results => res.send(results), reason => res.status(500).send(reason));
                        });
                    }
                }
                if (controller.HasPostRequests) {
                    for (const postRequest of controller.PostRequests()) {
                        this.server.post(postRequest.Route, (req: Request, res: Response) => {
        
                            const state = controller.SetRequestState(postRequest.Action, req, res);
                            const controllerAction = controller[postRequest.Action](...state.Params);
        
                            Promise.resolve(controllerAction).then(results => res.send(results), reason => res.status(500).send(reason));
                        });
                    }
                }
            }
            
            if (callback) {
                (callback as any)();
            }
        });
    }

    get router(): string {
        return this.server.router;
    };

    get settings(): any {
        return this.server.settings;
    }

    get resource(): any {
        return this.server.resource;
    }

    get map(): any {
        return this.server.map;
    };

    get locals(): Record<string, any> & Locals {
        return this.server.locals;
    }

    get routes(): any {
        return this.server.routes;
    }

    get _router(): any {
        return this.server._router;
    }

    get use(): ApplicationRequestHandler<this> {
        return this.generic.use;
    }

    get on(): (event: string, callback: (parent: Application<Record<string, any>>) => void) => this {
        return this.generic.on;
    }

    get mountpath(): string | string[] {
        return this.server.mountpath;
    }

    addListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
    addListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
    addListener(eventName: unknown, listener: unknown): this {
        this.generic.addListener(eventName, listener);
        return this;
    }

    once(eventName: string | symbol, listener: (...args: any[]) => void): this;
    once(eventName: string | symbol, listener: (...args: any[]) => void): this;
    once(eventName: unknown, listener: unknown): this {
        this.generic.once(eventName, listener);
        return this;
    }

    removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
    removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
    removeListener(eventName: unknown, listener: unknown): this {
        this.generic.removeListener(eventName, listener);
        return this;
    }

    off(eventName: string | symbol, listener: (...args: any[]) => void): this;
    off(eventName: string | symbol, listener: (...args: any[]) => void): this;
    off(eventName: unknown, listener: unknown): this {
        this.generic.off(eventName, listener);
        return this;
    }

    removeAllListeners(event?: string | symbol | undefined): this;
    removeAllListeners(event?: string | symbol | undefined): this;
    removeAllListeners(event?: unknown): this {
        this.generic.removeAllListeners(event);
        return this;
    }

    setMaxListeners(n: number): this;
    setMaxListeners(n: number): this;
    setMaxListeners(n: unknown): this {
        this.generic.setMaxListeners(n);
        return this;
    }

    getMaxListeners(): number;
    getMaxListeners(): number;
    getMaxListeners(): number {
        return this.server.getMaxListeners();
    }

    listeners(eventName: string | symbol): Function[];
    listeners(eventName: string | symbol): Function[];
    listeners(eventName: unknown): Function[] {
        return this.generic.listeners(eventName);
    }

    rawListeners(eventName: string | symbol): Function[];
    rawListeners(eventName: string | symbol): Function[];
    rawListeners(eventName: unknown): Function[] {
        return this.generic.rawListeners(eventName);
    }

    emit(eventName: string | symbol, ...args: any[]): boolean;
    emit(eventName: string | symbol, ...args: any[]): boolean;
    emit(eventName: unknown, ...args: unknown[]): boolean {
        return this.generic.emit(eventName, args);
    }

    listenerCount(eventName: string | symbol): number;
    listenerCount(eventName: string | symbol): number;
    listenerCount(eventName: unknown): number {
        return this.generic.listenerCount(eventName);
    }

    prependListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
    prependListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
    prependListener(eventName: unknown, listener: unknown): this {
        this.generic.prependListener(eventName, listener);
        return this;
    }

    prependOnceListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
    prependOnceListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
    prependOnceListener(eventName: unknown, listener: unknown): this {
        this.generic.prependOnceListener(eventName, listener);
        return this;
    }

    eventNames(): (string | symbol)[];
    eventNames(): (string | symbol)[];
    eventNames(): (string | symbol)[] {
        return this.server.eventNames();
    }

    get all(): IRouterMatcher<this, "all"> {
        return this.generic.all;
    }

    get post(): IRouterMatcher<this, "post"> {
        return this.generic.post;
    }

    get put(): IRouterMatcher<this, "put"> {
        return this.generic.put;
    }

    get delete(): IRouterMatcher<this, "delete"> {
        return this.generic.delete;
    }

    get patch(): IRouterMatcher<this, "patch"> {
        return this.generic.patch;
    }

    get options(): IRouterMatcher<this, "options"> {
        return this.generic.options;
    }

    get head(): IRouterMatcher<this, "head"> {
        return this.generic.head;
    }

    get checkout(): IRouterMatcher<this, any> {
        return this.generic.checkout;
    }

    get connect(): IRouterMatcher<this, any> {
        return this.generic.connect;
    }

    get copy(): IRouterMatcher<this, any> {
        return this.generic.copy;
    }

    get lock(): IRouterMatcher<this, any> {
        return this.generic.lock;
    }

    get merge(): IRouterMatcher<this, any> {
        return this.generic.merge;
    }

    get mkactivity(): IRouterMatcher<this, any> {
        return this.generic.mkactivity;
    }

    get mkcol(): IRouterMatcher<this, any> {
        return this.generic.mkcol;
    }

    get move(): IRouterMatcher<this, any> {
        return this.generic.move;
    }

    get notify(): IRouterMatcher<this, any> {
        return this.generic.notify;
    }

    get propfind(): IRouterMatcher<this, any> {
        return this.generic.propfind;
    }

    get proppatch(): IRouterMatcher<this, any> {
        return this.generic.proppatch;
    }

    get purge(): IRouterMatcher<this, any> {
        return this.generic.purge;
    }

    get report(): IRouterMatcher<this, any> {
        return this.generic.report;
    }

    get search(): IRouterMatcher<this, any> {
        return this.generic.search;
    }

    'm-search': IRouterMatcher<this>;

    get subscribe(): IRouterMatcher<this, any> {
        return this.generic.subscribe;
    }

    get trace(): IRouterMatcher<this, any> {
        return this.generic.trace;
    }

    get unlock(): IRouterMatcher<this, any> {
        return this.generic.unlock;
    }

    get unsubscribe(): IRouterMatcher<this, any> {
        return this.generic.unsubscribe;
    }
    
    route<T extends string>(prefix: T): IRoute<T>;
    route(prefix: PathParams): IRoute<string>;
    route(prefix: unknown): import("express-serve-static-core").IRoute<any> | import("express-serve-static-core").IRoute<string> {
        return this.generic.route(prefix);
    }

    get stack(): any[] {
        return this.generic.stack;
    }

}