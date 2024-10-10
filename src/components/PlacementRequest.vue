<template>
  <div class="left-row request">
    <div class="request-img-container">
      <ion-img :src="imageSrc"/>
    </div>
    <div class="left-col req-mar">
      <p class="text-black">
        {{title}}
      </p>
      <label class="text-dark-grey">
        {{subTitle}}
      </label>
      <div class="left-row" v-if="status == 'pending' && sentTo == 'set_designer'">
        <button @click="process_request(product_id, product_placement_id, 'accepted')" class="black-small">
          Accept
        </button>
        <button class="red-small" @click="process_request(product_id, product_placement_id, 'declined')">
          Decline
        </button>
      </div>
      <span class="grey-border-small" v-if="status == 'pending' && sentTo == 'brand_manager'">
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

import {IonImg} from "@ionic/vue";

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
    sentTo: {
      type: String,
      required: true,
    },
    product_id: {
      type: [String, Number],
      required: true,
    },
    product_placement_id: {
      type: [String, Number],
      required: true,
    },
    process_request: {
      type: Function,
      required: true
    }
  },
  computed: {
    imageSrc(): string {
      return `data:image/png;base64,${this.image}`;
    }
  },
  components: {
    IonImg
  },
}
</script>