<template>
  <!-- The main container for the product placement details -->
  <article class="left-col">
    <!-- Title of the product placement -->
    <h4 class="text-black input-search">
      {{name}}
    </h4>
    <!-- Label for the desired item -->
    <label class="text-red">
      {{'Desired Item: ' + desiredItem}}
    </label>
    <!-- Description of the product placement -->
    <p class="text-dark-grey">
      {{description}}
    </p>
    <!-- Button to toggle the visibility of requests -->
    <button v-if="requests.length != 0" @click="toggleRequests" class="clear left-row small-text">
      {{requestsShow ? 'Hide requests' : 'Show requests'}}
      <ion-img :style="requestsShow ? 'rotate:180deg' : 'rotate:0'" src="/svg/down-arrow.svg"/>
    </button>
    <div class="left-col" v-if="requestsShow">
      <!-- Display a list of PlacementRequest components based on the requests -->
      <PlacementRequest :process_request="process_request" :sent-to="request.sent_to" :product_id="request.product_id" :product_placement_id="id" :title="request.title" :image="request.files" :sub-title="request.brand" :status="request.response" :key="index" v-for="(request, index) in requests"/>
    </div>
  </article>
</template>

<script lang="ts">
/**
 * ProductPlacement component displays details about a product placement request.
 * It shows the name, desired item, description, and a toggleable list of associated requests.
 *
 * @example
 * <ProductPlacement
 *   :id="'123'"
 *   :name="'Product Name'"
 *   :desiredItem="'Desired Item'"
 *   :description="'This is the description.'"
 *   :requests="[{ product_id: 1, sent_to: 'someone', title: 'Request 1', brand: 'Brand A', response: 'Pending', files: [] }]"
 *   :process_request="(request) => { console.log('Processing:', request) }"
 * />
 */

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
      /**
       * A flag to control the visibility of the requests section.
       */
      requestsShow: false,
    }
  },
  props: {
    /**
     * The unique ID for the product placement.
     */
    id: {
      type: [String, Number],
      required: true,
    },

    /**
     * The name of the product placement.
     */
    name: {
      type: String,
      required: true,
    },

    /**
     * The name of the desired item for the placement.
     */
    desiredItem: {
      type: String,
      required: true,
    },

    /**
     * The description of the product placement.
     */
    description: {
      type: String,
      required: true,
    },

    /**
     * An array of product placement requests related to the product placement.
     */
    requests: {
      type: Array as () => productPlacementRequestType[],
      required: true,
    },

    /**
     * A function to process the requests.
     */
    process_request: {
      type: Function,
      required: true,
    },
  },
  methods: {
    /**
     * Toggles the visibility of the requests section.
     */
    toggleRequests() {
      this.requestsShow = !this.requestsShow
    }
  }
}

</script>

