import { Requestable } from "../engine/_wire_/Requestable";

export const Get = (route: string) => (target: Requestable, key: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
    const previous = target.GetRequests ?? (() => ([]));
    target.GetRequests = () => {
        return [ ...previous(), { Route: route, Action: key as string } ];
    };
    return descriptor;
};

export const Post = (route: string) => (target: Requestable, key: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
    const previous = target.PostRequests ?? (() => ([]));
    target.PostRequests = () => {
        return [ ...previous(), { Route: route, Action: key as string } ];
    };
    return descriptor;
};