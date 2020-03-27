/* eslint-disable */

// Import Doka itself
import { supported } from './lib/doka.esm.min';
import './lib/doka.min.css';

// Import Doka Vue Components
import Doka from './components/Doka.vue';
import DokaModal from './components/DokaModal.vue';
import DokaOverlay from './components/DokaOverlay.vue';

// Utils
import { toURL } from './utils/toURL';

// Test once if Doka is supported on this environment
const isSupported = supported();

export {
    // Components
    Doka,
    DokaModal,
    DokaOverlay,

    // Utilities
    toURL,
    isSupported
}