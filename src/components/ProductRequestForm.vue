<template>
  <div :class="{'active': isActive}" class="popup-background">
    <section class="popup-section item">
      <div class="space-apart-row">
        <h3 class="text-black">
          Requests
        </h3>
        <button @click="toggleActive" class="clear">
          <ion-img src="/svg/exit.svg"/>
        </button>
      </div>
      <label class="text-red">
        Make a Request
      </label>
      <div class="dropdown-square">
        <button>
          Select a product placement
          <ion-img src="/svg/down-arrow-red.svg"/>
        </button>
      </div>
      <input placeholder="Scene title" class="square" type="text"/>
      <div class="dropdown-square">
        <button>
          Product Category
          <ion-img src="/svg/down-arrow-red.svg"/>
        </button>
      </div>
      <textarea placeholder="Add a note (optional)"/>
      <button class="red">
        Submit
      </button>
      <div class="left-col" v-if="requests.length > 0">
        <label class="text-red">
          Outgoing Requests
        </label>
        <PlacementRequest :title="request.name" :status="request.status" :sub-title="request.description" :image="request.image" :key="key" v-for="(request,key) in requests"/>
      </div>
      <hr v-if="received.length > 0 && requests.length > 0">
      <div class="left-col" v-if="received.length > 0">
        <label class="text-red">
          Incoming Requests
        </label>
        <PlacementRequest :title="request.name" :status="request.status" :sub-title="request.description" :image="request.image" :key="key" v-for="(request,key) in received"/>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import PlacementRequest from "./PlacementRequest.vue";

export default {
  components: {
    PlacementRequest
  },
  props: {
    isActive: {
      type: Boolean,
      required: true,
    },
    toggleActive: {
      type: Function,
      required: true,
    },
    requests: {
      type: Array,
      required: true,
    },
    received: {
      type: Array,
      required: true,
    }
  }
}

</script>