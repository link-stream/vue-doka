<template>
  <div class="doka-container">
    <div>
        <slot></slot>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
/* tslint:disable */
import { createDokaComponent } from '../utils/createDoka.js';
export default createDokaComponent({
    name: 'Doka'
});
</script>