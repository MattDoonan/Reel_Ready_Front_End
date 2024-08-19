<script setup lang="ts">

import {IonImg} from "@ionic/vue";
</script>

<template>
  <div class="left-row request">
    <div class="request-img-container">
      <ion-img :src="imageSrc"/>
    </div>
    <div class="left-col">
      <p class="text-black">
        {{title}}
      </p>
      <label class="text-dark-grey">
        {{subTitle}}
      </label>
      <div class="left-row" v-if="status == 'requested'">
        <button class="black-small">
          Accept
        </button>
        <button class="red-small">
          Decline
        </button>
      </div>
      <span class="grey-border-small" v-if="status == 'pending'">
        Pending...
      </span>
      <span class="black-border-small" v-if="status == 'accepted'">
        Accepted
      </span>
      <span class="red-border-small" v-if="status == 'declined'">
        Declined
      </span>
    </div>
  </div>
</template>

<script lang="ts">

export default {
  data() {
    return {
      requestsShow: false,
    }
  },
  props: {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  computed: {
    imageSrc(): string {
      return `data:image/png;base64,${this.image}`;
    }
  },
}
</script>