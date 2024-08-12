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
    <button @click="toggleRequests" class="clear left-row small-text">
      {{requestsShow ? 'Hide requests' : 'Show requests'}}
      <ion-img :style="requestsShow ? 'rotate:180deg' : 'rotate:0'" src="/svg/down-arrow.svg"/>
    </button>
    <div class="left-col request-container" v-if="requestsShow">
      <PlacementRequest :title="request.name" :image="request.image" :sub-title="request.brand" :status="request.status" :key="index" v-for="(request, index) in requests"/>
    </div>
  </article>
</template>

<script lang="ts">

import PlacementRequest from "./PlacementRequest.vue";

export default {
  components: {
    PlacementRequest,
  },
  data() {
    return {
      requestsShow: false,
    }
  },
  props: {
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
      type: Array,
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

