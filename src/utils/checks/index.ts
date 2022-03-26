export const isEmpty = (value :unknown) : boolean => {
    if(isArray(value) || isString(value)) {
        return !value.length;
    } else if(isObject(value)) {
        return !Object.keys(value).length;
    }
    return value === null || value === undefined;
};

export const isArray = (value: unknown): value is Array<unknown> => Array.isArray(value);

export const isString = (value: unknown): value is string => typeof value === 'string';

export const isObject = (value : unknown) : value is Object => typeof value === 'object';