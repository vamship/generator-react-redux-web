import { call } from 'redux-saga/effects';
import fetch from 'isomorphic-fetch';

import UrlPathTemplate from '../../../utils/url-path-template';
import { apiRoot } from '../../../config';

/**
 * API client class that abstracts AJAX requests made to an HTTP endpoint.
 * This class is designed to be used with redux sagas, and exposes operations
 * as generator functions.
 */
export default class ApiClient {
    /**
     * @param {String} path The URL path of the resource that is being accessed.
     *        The URL must be specified as a relative URL. The root url will be
     *        obtained from config and prefixed to it.
     *        The path can contain token placeholders in the form
     *        of `${<token name>}`, which will be replaced with actual tokens
     *        if a map is provided during API invocation.
     * @param {Object} [headers={
     *          'Content-Type': 'application/json',
     *          'Accept': 'application/json'
     *        }] An optional set of headers to use when
     *        making the API request. If not specified, a defautl header
     *        object will be used. If content type and accept headers are
     *        not specified, default values will be used for these headers.
     */
    constructor(path, headers) {
        if (typeof path !== 'string' || path.length <= 0) {
            throw new Error('Invalid path specified (arg #1)');
        }

        this._path = new UrlPathTemplate(path);
        this._headers = Object.assign({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }, headers);
    }

    /**
     * Returns a boolean parameter that indicates that the request is sending
     * binary data.
     *
     * @private
     * @return {Boolean} True if the request is sending binary data, false
     *         otherwise.
     */
    get _isBinaryRequest() {
        // Note: This condition may have to be updated based on specific use
        // cases. The current assumption is that if the request is not JSON,
        // it must be binary.
        return this._headers['Content-Type'] != 'application/json';
    }

    /**
     * Generic method that performs an API request, and provides basic request
     * processing and error handling.
     *
     * @private
     * @param {String} method The http method to use when making the request.
     * @param {Object} tokens A token map to use when replacing tokenized
     *        values in the request url
     * @param {Object} body The request body
     *
     * @return {Object} The response from the HTTP request.
     */
    * _invokeAPI(method, tokens, body) {
        try {
            const url = `${apiRoot}${this._path.getPath(tokens)}`;
            const headers = Object.assign({}, this._headers);

            if (!this._isBinaryRequest) {
                body = body ? JSON.stringify(body) : undefined;
            }
            const options = Object.assign({}, {
                method
            }, {
                headers
            });
            options.body = body;
            const response = yield call(fetch, url, options);
            if (!response.ok) {
                throw new Error(`${method} failed for [${this._path}] with status: [${response.status}]. Message: [${response.statusText}]`);
            }
            if (response.headers.get('Content-Type').match(/^application\/json/)) {
                return yield call(() => {
                        return response.json();
                    });
            } else {
                return yield call(() => {
                        return response.text();
                    });
            }
        } catch (ex) {
            const errorMessage = `Error executing ${method} for [${this._path}]. Details: [${ex.message}]`;
            throw new Error(errorMessage);
        }
    }

    /**
     * Generator function that performs a GET request and ultimately yields
     * resource data or throws an error if the fetch fails.
     *
     * @param {Object} [tokens={}] An optional map that maps tokens in the
     *        url to their values.
     *
     * @return {Object} The data obtained from the resource.
     */
    * get(tokens) {
        if (!tokens || (tokens instanceof Array) || typeof tokens !== 'object') {
            tokens = {};
        }

        return yield this._invokeAPI('GET', tokens);
    }

    /**
     * Generator function that performs a DELETE request and ultimately yields
     * the api response or throws an error if the operation fails.
     *
     * @param {Object} [tokens={}] An optional map that maps tokens in the
     *        url to their values.
     *
     * @return {Object} The result of the delete operation as returned by the
     *         api.
     */
    * delete(tokens) {
        if (!tokens || (tokens instanceof Array) || typeof tokens !== 'object') {
            tokens = {};
        }

        return yield this._invokeAPI('DELETE', tokens);
    }

    /**
     * Generator function that performs a POST request and ultimately yields
     * resource data or throws an error if the fetch fails.
     *
     * @param {Object} [tokens={}] An optional map that maps tokens in the
     *        url to their values.
     * @param {Object} body The body of the HTTP post request.
     *
     * @return {Object} The data obtained from the resource.
     */
    * post(tokens, body) {
        if (!tokens || (tokens instanceof Array) || typeof tokens !== 'object') {
            tokens = {};
        }
        if (!body || (body instanceof Array) || typeof body !== 'object') {
            throw new Error('Invalid body specified (arg #2)');
        }

        return yield this._invokeAPI('POST', tokens, body);
    }

    /**
     * Generator function that performs a PUT request and ultimately yields
     * resource data or throws an error if the fetch fails.
     *
     * @param {Object} [tokens={}] An optional map that maps tokens in the
     *        url to their values.
     * @param {Object} body The body of the HTTP put request.
     *
     * @return {Object} The data obtained from the resource.
     */
    * put(tokens, body) {
        if (!tokens || (tokens instanceof Array) || typeof tokens !== 'object') {
            tokens = {};
        }
        if (!body || (body instanceof Array) || typeof body !== 'object') {
            throw new Error('Invalid body specified (arg #2)');
        }

        return yield this._invokeAPI('PUT', tokens, body);
    }
}
