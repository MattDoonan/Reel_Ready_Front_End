<template>
  <!--
    Router link that navigates to a dynamic route with a specified id, and displays an image, heading, and subheading.
    - The component accepts props for id, linkHeading, image, heading, and subHeading.
  -->
  <router-link class="left-col listItem" :to="{name: linkHeading, params: {id: id}}">
    <div class="img-container-list">
      <ion-img :alt="'image ' + id" :src="imageSrc"/>
    </div>
    <h3>
      {{heading}}
    </h3>
    <h4>
      {{subHeading}}
    </h4>
  </router-link>
</template>

<script lang="ts">
/**
 * A component that displays a list item with an image, heading, and subheading.
 * The list item is a clickable router link that navigates to a dynamic route.
 * Used for displaying projects and products
 *
 * @component
 * @example
 * <ListItem
 *   :id="1"
 *   :linkHeading="'item-detail'"
 *   :image="base64ImageString"
 *   :heading="'Item Heading'"
 *   :subHeading="'Item Subheading'"
 * />
 */


import {IonImg} from "@ionic/vue";

export default {
  props: {

    /**
     * The unique identifier for the item (String or Number).
     */
    id: {
      require: true,
      type: [String, Number],
    },

    /**
     * The name of the route to navigate to (String).
     */
    linkHeading: {
      require: true,
      type: String,
    },

    /**
     * A base64-encoded string representing the image to display (String).
     */
    image: {
      require: true,
      type: String,
    },

    /**
     * The main title or heading for the item (String).
     */
    heading: {
      require: true,
      type: String,
    },

    /**
     * The secondary title or subheading for the item (String).
     */
    subHeading: {
      require: true,
      type: String,
    },
  },
  components: {IonImg},
  computed: {
    /**
     * Computed property to generate the full image source string for rendering.
     * The image is base64-encoded and embedded within a data URL.
     *
     * @returns {string} The base64 image string prefixed with the appropriate data URL format.
     */
    imageSrc(): string {
      return `data:image/png;base64,${this.image}`;
    }
  }
}
</script>
