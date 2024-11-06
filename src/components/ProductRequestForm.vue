<template>
  <!-- This component contains the popup UI for making and viewing product requests -->
  <div :class="{'active': isActive}" class="popup-background">
    <section class="popup-section item">
      <!-- Header with title and close button -->
      <div class="space-apart-row">
        <h3 class="text-black">
          Requests
        </h3>
        <button @click="toggleActive()" class="clear">
          <ion-img alt="exit" src="/svg/exit.svg"/>
        </button>
      </div>
      <!-- Request form with error handling -->
      <label class="text-red">
        Make a Request
      </label>
      <div :class="{'error': formError}" class="dropdown-square">
        <button :class="{'active' : dropDownActive}" @click="toggleDropdown">
          {{ selectedProductPlacement === null ? 'Select a product placement' : selectedProductPlacement.name }}
          <ion-img :style="{ transform: dropDownActive ? 'rotate(180deg)' : 'none' }" src="/svg/down-arrow-red.svg"/>
        </button>
        <!-- Dropdown list for selecting a product placement -->
        <div v-if="dropDownActive">
          <button @click="selectItem(ppName)" class="clear text-black" :key='index' v-for="(ppName, index) in updatedNames">
            {{ppName.name}}
          </button>
          <button v-if="updatedNames.length == 0" class="no-hover text-black">
            No valid product placements
          </button>
        </div>
      </div>
      <!-- Submit button for the request -->
      <button @click="checkRequest" class="red">
        Submit
      </button>
      <!-- Outgoing requests section -->
      <div class="left-col" v-if="requests.length > 0">
        <label class="text-red">
          Outgoing Requests
        </label>
        <PlacementRequest :process_request="process_request" :product_placement_id="request.product_placement_id" :product_id="request.product_id.toString()" :sent-to="request.sent_to" :title="request.title" :status="request.response" :sub-title="request.scene_description" :image="request.image" :key="key" v-for="(request,key) in requests"/>
      </div>
      <hr v-if="received.length > 0 && requests.length > 0">
      <!-- Incoming requests section -->
      <div class="left-col" v-if="received.length > 0">
        <label class="text-red">
          Incoming Requests
        </label>
        <PlacementRequest :process_request="process_request" :product_placement_id="request.product_placement_id" :product_id="request.product_id" :sent-to="request.sent_to" :title="request.title" :status="request.response" :sub-title="request.scene_description" :image="request.image" :key="key" v-for="(request,key) in received"/>
      </div>
      <!-- Message when there are no requests -->
      <h3 v-if="requests.length === 0 && received.length === 0" class="text-dark-grey hidden">
        No request
      </h3>
    </section>
  </div>
</template>

<script lang="ts">
/**
 * This component provides functionality to select a product placement, make a request for product use,
 * and display outgoing and incoming requests. It includes a dropdown for selecting product placements
 * and buttons to submit or cancel requests. It can be used to interact with requests in a set design context.
 *
 * Example Usage:
 * <ProductRequestManager
 *   :isActive="true"
 *   :requests="requestsData"
 *   :received="receivedData"
 *   :productPlacementNames="placementNames"
 *   :productId="123"
 *   :updateSentReq="updateSentRequest"
 *   :process_request="processRequest"
 *   :toggleActive="togglePopupVisibility"
 * />
 */

import PlacementRequest from "./PlacementRequest.vue";
import {productPlacementNamesType, productRequestType} from "@/types";
import axios from "axios";
import {url, user_code} from "@/base_information";
import {IonImg} from "@ionic/vue";
import {ref} from "vue";

export default {
  components: {
    PlacementRequest,
    IonImg
  },
  data() {
    return {
      // Toggle for dropdown visibility
      dropDownActive: false,
      // Flag for form validation error
      formError: false,
    }
  },
  setup() {
    const selectedProductPlacement = ref<productPlacementNamesType | null>(null);

    /**
     * Sets the selected product placement.
     * @param ppName The selected product placement.
     */
    const selectPPName = (ppName: productPlacementNamesType | null) => {
      selectedProductPlacement.value = ppName
    }
    return {
      selectedProductPlacement,
      selectPPName,
    };
  },
  props: {
    // Indicates whether the popup is active
    isActive: {
      type: Boolean,
      required: true,
    },
    // Function to toggle the popup visibility
    toggleActive: {
      type: Function,
      required: true,
    },
    // List of outgoing requests
    requests: {
      type: Array as () => productRequestType[],
      required: true,
    },
    // List of incoming requests
    received: {
      type: Array as () => productRequestType[],
      required: true,
    },
    // List of available product placements to send a request
    productPlacementNames: {
      type: Array as () => productPlacementNamesType[],
      required: true,
    },
    // ID of the product being requested
    productId: {
      type: [String, Number],
      required: true,
    },
    // Function to update the sent requests
    updateSentReq: {
      type: Function,
      required: true,
    },
    // Function to process incoming or outgoing requests
    process_request: {
      type: Function,
      required: true
    }
  },
  methods: {
    /**
     * Validates and submits the product request.
     */
    checkRequest() {
      this.formError = false
      if (!this.selectedProductPlacement || !this.productId) {
        this.formError = true;
      } else {
        this.addProductRequest(this.productId, this.selectedProductPlacement.id);
      }
    },

    /**
     * Selects a product placement from the dropdown list.
     * @param ppName The selected product placement.
     */
    selectItem(ppName: productPlacementNamesType) {
      this.selectPPName(ppName);
      this.dropDownActive = false;
    },

    /**
     * Sends the product request to the server.
     * @param product_id The ID of the product being requested.
     * @param product_placement_id The ID of the selected product placement.
     */
    async addProductRequest(product_id:string, product_placement_id:string) {
      try {
        const response = await axios.post(url + `request_product_use/${user_code}`, {
          product_id: product_id,
          product_placement_id: product_placement_id,
        });
        if (response.status === 201) {
          this.updateSentReq(response.data);
          this.selectPPName(null);
        } else {
          this.formError = true
        }
      } catch (error) {
        console.log("Error adding a product request")
        this.formError = true
      }
    },

    /**
     * Toggles the visibility of the product placement dropdown.
     */
    toggleDropdown() {
      this.dropDownActive = !this.dropDownActive;
    },
  },
  computed: {
    /**
     * Filters and returns available product placements that are not selected
     * and are not part of existing requests.
     */
    updatedNames() {
      return this.productPlacementNames.filter(pp =>
          pp !== this.selectedProductPlacement &&
          !this.requests.some(request => request.title.toLowerCase() === pp.name.toLowerCase()) &&
          !this.received.some(request => request.title.toLowerCase() === pp.name.toLowerCase())
      );
    }
  }
}
</script>