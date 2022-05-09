export function toCamelCase(input: string) {
    return (
        input.match(/([A-Z0-9]+[a-z]*)/g)?.reduce((acc, val) => {
            if (acc) {
                return (acc += `${val[0].toUpperCase()}${val
                    .slice(1)
                    .toLowerCase()}`);
            }
            return val.toLowerCase();
        }, "") || ""
    );
}
