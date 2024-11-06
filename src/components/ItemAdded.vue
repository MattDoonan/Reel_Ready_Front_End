<template>
  <!--
   Popup component that is displayed when 'isActive' is equal to 2.
   It displays a section with some text and a button to close the popup.
 -->
  <div :class="{'active': isActive === 2}" class="popup-background">
    <section class="popup-section item_added">
      <div class="space-apart-row">
        <span></span>
        <button @click="toggleActive(0)" class="clear">
          <ion-img src="/svg/exit.svg"/>
        </button>
      </div>
      <h3 class="text-black ion-text-center">
        {{text}}
      </h3>
    </section>
  </div>
</template>

<script type="ts">
/**
 * A popup component that displays when the 'isActive' prop equals 2.
 * It shows a close button and customizable text content.
 *
 * @component
 * @example
 * <Popup :isActive="2" :text="'Your custom message here'" :toggleActive="toggleFunction"/>
 */

import {defineComponent} from "vue";
import {IonImg} from "@ionic/vue";

export default {
  components: {IonImg},
  props: {
    /**
     * Determines the active state of the popup.
     * When this value is 2, the popup is displayed.
     */
    isActive: {
      type: Number,
      required: true,
    },

    /**
     * The text that will be shown inside the popup.
     */
    text: {
      type: String,
      required: true,
    },

    /**
     * Function to toggle the active state of the popup.
     */
    toggleActive: {
      type: Function,
      required: true,
    },
  }
}
</script>