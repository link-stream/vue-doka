/* eslint-disable */

// Turn src into url for use in image tag
export const toURL = (src) => src instanceof Blob ? URL.createObjectURL(src) : src;