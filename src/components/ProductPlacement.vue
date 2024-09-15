<script setup lang="ts">

</script>

<template>
  <article class="left-col">
    <h4 class="text-black input-search">
      {{name}}
    </h4>
    <label class="text-red">
      {{'Desired Item: ' + desiredItem}}
    </label>
    <p class="text-dark-grey">
      {{description}}
    </p>
    <button v-if="requests.length != 0" @click="toggleRequests" class="clear left-row small-text">
      {{requestsShow ? 'Hide requests' : 'Show requests'}}
      <ion-img :style="requestsShow ? 'rotate:180deg' : 'rotate:0'" src="/svg/down-arrow.svg"/>
    </button>
    <div class="left-col request-container" v-if="requestsShow">
      <PlacementRequest :process_request="process_request" :sent-to="request.sent_to" :product_id="request.product_id" :product_placement_id="id" :title="request.title" :image="request.files" :sub-title="request.brand" :status="request.response" :key="index" v-for="(request, index) in requests"/>
    </div>
  </article>
</template>

<script lang="ts">

import PlacementRequest from "./PlacementRequest.vue";
import {productPlacementRequestType} from "@/types"
import {IonImg} from "@ionic/vue";

export default {
  components: {
    PlacementRequest,
    IonImg
  },
  data() {
    return {
      requestsShow: false,
    }
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    desiredItem: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requests: {
      type: Array as () => productPlacementRequestType[],
      required: true,
    },
    process_request: {
      type: Function,
      required: true,
    },
  },
  methods: {
    toggleRequests() {
      this.requestsShow = !this.requestsShow
    }
  }
}

</script>

