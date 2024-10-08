
<template>
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

import {defineComponent} from "vue";
import {IonImg} from "@ionic/vue";

export default {
  components: {IonImg},
  props: {
    isActive: {
      type: Number,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    toggleActive: {
      type: Function,
      required: true,
    },
  }
}
</script>