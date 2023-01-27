import { Postable } from "../engine/_wire_/Postable";
import { Queryable } from "../engine/_wire_/Queryable";
import { Routable } from "../engine/_wire_/Routable";

export const FromBody = (target: Postable, methodKey: string, parameterIndex: number) => {
    const previous = target.GetBodyParameters ?? (() => ([]));
    target.GetBodyParameters = (action?: string) => {
        const results = [ ...previous(), { Action: methodKey, ParamIndex: parameterIndex }];
        return action ? results.filter(e => e.Action === action) : results;
    };
};

export const FromQuery = (queryKey: string) => (target: Queryable, methodKey: string, parameterIndex: number) => {
    const previous = target.GetQueryParameters ?? (() => ([]));
    target.GetQueryParameters = (action?: string) => {
        const results = [ ...previous(), { Action: methodKey, ParamIndex: parameterIndex, Key: queryKey } ];
        return action ? results.filter(e => e.Action === action) : results;
    };
};

export const FromRoute = (routeKey: string) => (target: Routable, methodKey: string, parameterIndex: number) => {
    const previous = target.GetRouteParameters ?? (() => ([]));
    target.GetRouteParameters = (action?: string) => {
        const results = [ ...previous(), { Action: methodKey, ParamIndex: parameterIndex, Key: routeKey } ];
        return action ? results.filter(e => e.Action === action) : results;
    };
};