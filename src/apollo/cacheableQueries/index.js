import QUERIES from './queries.json';

/**
 * @param {gqlDirective[]} opList
 */
const extractQueries = (opList = []) => {
    const result = [];

    opList.forEach(op => {
        if (op.operation === 'query') {
            op?.selectionSet?.selections.forEach(selection => {
                result.push(selection.name.value);
            });
        }
    });

    return result;
};

/**
 * @param {gqlRequest} gqlReq
 * @returns {boolean}
 */
const isGqlRequestCacheable = gqlReq => {
    try {
        const { query } = gqlReq;
        const mutations = query?.definitions?.filter(
            def => def.kind === 'OperationDefinition' && def.operation === 'mutation'
        );

        if (mutations.length) return false;

        const queries = query?.definitions?.filter(
            def => def.kind === 'OperationDefinition' && def.operation === 'query'
        );

        return extractQueries(queries).every(query => QUERIES.includes(query));
    } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
            console.error(e);
        }

        return false;
    }
};

export default isGqlRequestCacheable;

/**
 * @typedef gqlSelection
 * @property {string} alias
 * @property {array} directives
 * @property {string} kind
 * @property {{kind: string, value: string}} name
 * @property {gqlSelectionSet} selectionSet
 */
/**
 * @typedef gqlSelectionSet
 * @property {gqlSelection[]} selections
 * @property {string} kind
 */
/**
 * @typedef gqlDirective
 * @property {array} directives
 * @property {string} kind
 * @property {{kind: string, value: string}} name
 * @property {string} operation
 * @property {gqlSelectionSet} selectionSet
 */
/**
 * @typedef gqlRequest
 * @property {object} variables
 * @property {object} extensions
 * @property {{kind: string, definitions: gqlDirective[]}} query
 * @property {string} operationName
 */
