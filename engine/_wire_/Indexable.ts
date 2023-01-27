export interface Indexable {
    [key: string]: ((...params: any[]) => any) | any;
}