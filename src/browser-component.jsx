/**
 * Components and API for usage directly in the browser.
 */

import React, { useState, useReducer, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { TopspinForm, FormState, FIELDS, TEMPLATES, WIDGETS, CLASSNAMES } from '.';


/**
 * This function implements the API to control the form in the browser.
 */
export function FormInstance(config) {
    this._populateDataInput = function(data) {
        document.getElementById(this.dataInputId).value = JSON.stringify(data);
    };

    this.config = config;

    this.containerId = config.containerId;
    this.dataInputId = config.dataInputId;

    this.schema = config.schema;
    this.data = config.data;
    this.initialFormState = FormState.create({schema: this.schema, data: this.data});
    this.formState = this.initialFormState;
    this.errorMap = config.errorMap;
    this.fileHandler = config.fileHandler;
    this.fileHandlerArgs = config.fileHandlerArgs || {};
    this.readonly = config.readonly || false;

    this.root = ReactDOM.createRoot(document.getElementById(this.containerId));

    this._populateDataInput(this.formState.data);

    this.eventListeners = null;

    this.addEventListener = function(event, listener) {
        if (this.eventListeners === null)
            this.eventListeners = {};

        if (!this.eventListeners.hasOwnProperty(event))
            this.eventListeners[event] = new Set();

        this.eventListeners[event].add(listener);
    };

    this.render = function() {
        try {
            this.root.render(
                <FormContainer
                    instance={this}
                    errorMap={this.errorMap}
                    fileHandler={this.fileHandler}
                    fileHandlerArgs={this.fileHandlerArgs}
                    onChange={this.onChange}
                    readonly={this.readonly}
                    initialFormState={this.initialFormState}
                    formStateReducer={this.formStateReducer}
                    fields={this.config.fields}
                    templates={this.config.templates}
                    widgets={this.config.widgets}
                    styleMap={this.config.styleMap}
                />
            );
        } catch (error) {
            this.root.render(<ErrorReporter error={error} />);
        }
    };

    this.formStateReducer = function(state, action) {
        if (!(action.nextState instanceof FormState)) {
            action.nextState = FormState.create({...action.nextState});
        }

        switch (action.type) {
            case 'update':
                this.formState = action.nextState;
                break;
        }

        this._populateDataInput(this.formState.data);

        if (!this.eventListeners)
            return action.nextState;

        if (!this.eventListeners.hasOwnProperty('change') || !this.eventListeners.change.size)
            return action.nextState;

        this.eventListeners.change.forEach((cb) => cb({
            data: action.nextState.data, prevData: state.data,
            schema: action.nextState.schema, prevSchema: state.schema,
        }));

        return action.nextState;
    }
    this.formStateReducer = this.formStateReducer.bind(this);

    this.formStateReducerDispatch = null; // this will be set by the FormContainer component

    this.updateState = function(state) {
        if (this.formStateReducerDispatch === null)
            return;

        let nextState;

        if (state.hasOwnProperty('data') && !state.hasOwnProperty('schema')) {
            nextState = FormState.update({state: this.formState, data: state.data});
        } else if (config.hasOwnProperty('schema')) {
            nextState = FormState.create(state.schema, state.data || this.formState.getData());
        }

        if (nextState)
            this.formStateReducerDispatch({'type': 'update', nextState: nextState || this.formState});
    };

    this.updateConfig = function(config) {
        this.errorMap = config.errorMap || this.errorMap;
        this.readonly = config.readonly || this.readonly;

        this.render();
    }

    this.reset = function() {
        if (this.formStateReducerDispatch === null)
            return;

        this.formStateReducerDispatch({'type': 'update', nextState: this.initialFormState});
    };

    this.unmount = function() {
        this.root.unmount();
    };

    this.getSchema = function() {
        return this.formState.getSchema();
    };

    this.getData = function() {
        return this.formState.getData();
    };

    this.validate = function() {
        let validator = new DataValidator(this.getSchema());
        return validator.validate(this.getData());
    };
}


const FORM_INSTANCES = {};

export function createForm(config) {
    let instance = new FormInstance(config);

    // save a reference to the instance
    FORM_INSTANCES[config.containerId] = instance;

    return instance;
}


export function getFormInstance(containerId) {
    return FORM_INSTANCES[containerId];
}


export function deleteFormInstance(containerId) {
    if (!containerId)
        return;

    const instance = getFormInstance(containerId);
    if (instance) {
        instance.unmount();
        delete FORM_INSTANCES[containerId];
    }
}


/**
 * A container component for the Topsin JSON form component.
 *
 * It holds the form's state and also serves as a bridge between React and
 * the API exposed to the browser (via the FormInstance function above).
 */
function FormContainer({
    instance,
    initialFormState,
    formStateReducer,
    errorMap,
    readonly,
    fields,
    templates,
    widgets,
    classnames,
}) {
    const [formState, dispatch] = useReducer(formStateReducer, initialFormState);

    useEffect(() => {
        instance.formStateReducerDispatch = dispatch;
    }, []);

    return (
        <TopspinForm
            formState={formState}
            onChange={(formState) => {
                return dispatch({type: 'update', nextState: formState});
            }}
            // fileHandler={this.props.fileHandler}
            // fileHandlerArgs={this.props.fileHandlerArgs}
            errorMap={errorMap}
            readonly={readonly}
            fields={{...FIELDS, ...(fields || {})}}
            templates={{...TEMPLATES, ...(templates || {})}}
            widgets={{...WIDGETS, ...(widgets || {})}}
            classnames={{...CLASSNAMES, ...(classnames || {})}}
        />
    );
    
}


/**
 * Component for displaying errors to the user related to the schema.
 */
function ErrorReporter(props) {
    return (
        <div style={{color: '#f00'}}>
            <p>(!) {props.error.toString()}</p>
            <p>Check browser console for more details about the error.</p>
        </div>
    );
}
