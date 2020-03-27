<template>
  <div class="doka-overlay">
    <slot></slot>
    <div class="doka-container">
        <div></div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
/* tslint:disable */
import { createDokaComponent } from '../utils/createDoka.js';
export default createDokaComponent(
    {
        name: 'DokaOverlay'
    },
    (component) => ({
        styleLayoutMode: 'preview',
        outputData: true,
        onclose: () => {
            component._instance.destroy();
            component._instance = null;
        }
    })
);
</script>
<style>
.doka-overlay {
    position: relative;
    overflow: hidden;
}

.doka-overlay > img {
    display: block;
    width: 100%;
    height: auto;
}

.doka-overlay > .doka-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}
</style>