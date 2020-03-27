/* eslint-disable */
import Vue from 'vue';

import { create, supported, OptionTypes } from '../lib/doka.esm.min';

// Test if Doka is supported on this environment
const isSupported = supported();

// Events that need to be mapped to emitters
const nativeEvents = Object.keys(OptionTypes).filter(key => /^on/.test(key));

// These keys are removed before passing options to Doka
const filteredKeys = ['id', 'class'];

// filtered methods
const filteredMethods = [
    'setOptions',
    'on',
    'off',
    'onOnce',
    'appendTo',
    'insertAfter',
    'insertBefore',
    'isAttachedTo',
    'replaceElement',
    'restoreElement',
    'destroy'
];

// These are the allowed props
export const allowedProps = Object.keys(OptionTypes).filter(key => !filteredKeys.includes(key));

// can also set enabled
allowedProps.push('enabled');

export const propsToElementAttributes = (base = {}, { id, style, className }) => {
    return {
        id: base.id || id,
        className: base.className.split(' ').concat(className).filter(n => n).join(' '),
        style: Object.assign({}, base.style || {}, style || {})
    };
}

const getOptionsFromProps = (props) => Object
    .keys(props)
    .filter(key => typeof props[key] !== 'undefined')
    .filter(prop => allowedProps.find(key => key.toLowerCase() === prop.toLowerCase()))
    .reduce((options, key) => {
        options[/^on/.test(key) ? key.toLocaleLowerCase() : key] = props[key];
        return options;
    }, {});

export const updateDoka = (instance, props) => instance.setOptions(getOptionsFromProps(props));

// Create a new Doka instance based on supplied props and root element
export const createDoka = (component, root, props = {}) => {

    if (!isSupported) return;

    // Map Doka callback methods to Vue $emitters
    const emitters = nativeEvents.reduce((events, event) => {
        events[event] = (...args) => {
            // strip of 'on' part
            const name = event.substr(2);

            // emit event
            component.$emit(name, ...args);
        };
        return events;
    }, {});

    // params will be passed to the Doka create method
    const params = [Object.assign({}, emitters, getOptionsFromProps(props))];

    // prepend the root element if it was supplied
    if (root) {
        params.unshift(root);
    }

    const instance = create(...params);

    // Copy instance method references to component instance
    Object.keys(instance)
        .filter(key => !filteredMethods.includes(key))
        .forEach(key => {
            component[key] = instance[key];
        });

    return instance;
}

export const createDokaComponent = (obj, forcedProps = () => ({})) => Vue.extend(Object.assign(obj, {
    props: allowedProps,
    methods: {
        update() {
            const { enabled } = this.$props;
            if (enabled || typeof enabled === 'undefined') {
                this.show();
            }
            else {
                this.hide();
            }
        },
        show() {

            // call update if the instance already exists
            if (this._instance) {
                return updateDoka(this._instance, this.$props);
            }

            // Wait for inner DOM to have rendered before init
            this.$nextTick(() => {
                this._root = this.$el && this.$el.classList ? this.$el.classList.contains('.doka-container') ? this.$el.firstChild : this.$el.querySelector('.doka-container > div') : null;
                this._instance = createDoka(this, this._root, Object.assign({}, this.$props, forcedProps(this)));
            });

        },
        hide() {
            if (!this._instance) return;
            this._instance.close();
        }
    },
    mounted() {

        // observe prop changes
        this.$watch('$props', () => {
            this.update();
        }, { deep: true });

        // update view
        this.update();
    },
    beforeDestroy() {
        if (!this._instance) return;
        this._instance.destroy();
    }
}))