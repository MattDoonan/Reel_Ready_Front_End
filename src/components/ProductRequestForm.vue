<template>
  <div :class="{'active': isActive}" class="popup-background">
    <section class="popup-section item">
      <div class="space-apart-row">
        <h3 class="text-black">
          Requests
        </h3>
        <button @click="toggleActive()" class="clear">
          <ion-img alt="exit" src="/svg/exit.svg"/>
        </button>
      </div>
      <label class="text-red">
        Make a Request
      </label>
      <div :class="{'error': formError}" class="dropdown-square">
        <button :class="{'active' : dropDownActive}" @click="toggleDropdown">
          {{ selectedProductPlacement === null ? 'Select a product placement' : selectedProductPlacement.name }}
          <ion-img :style="{ transform: dropDownActive ? 'rotate(180deg)' : 'none' }" src="/svg/down-arrow-red.svg"/>
        </button>
        <div v-if="dropDownActive">
          <button @click="selectItem(ppName)" class="clear text-black" :key='index' v-for="(ppName, index) in updatedNames">
            {{ppName.name}}
          </button>
          <button v-if="updatedNames.length == 0" class="no-hover text-black">
            No valid product placements
          </button>
        </div>
      </div>
      <button @click="checkRequest" class="red">
        Submit
      </button>
      <div class="left-col" v-if="requests.length > 0">
        <label class="text-red">
          Outgoing Requests
        </label>
        <PlacementRequest :process_request="process_request" :product_placement_id="request.product_placement_id" :product_id="request.product_id" :sent-to="request.sent_to" :title="request.title" :status="request.response" :sub-title="request.scene_description" :image="request.image" :key="key" v-for="(request,key) in requests"/>
      </div>
      <hr v-if="received.length > 0 && requests.length > 0">
      <div class="left-col" v-if="received.length > 0">
        <label class="text-red">
          Incoming Requests
        </label>
        <PlacementRequest :process_request="process_request" :product_placement_id="request.product_placement_id" :product_id="request.product_id" :sent-to="request.sent_to" :title="request.title" :status="request.response" :sub-title="request.scene_description" :image="request.image" :key="key" v-for="(request,key) in received"/>
      </div>
      <h3 v-if="requests.length === 0 && received.length === 0" class="text-dark-grey hidden">
        No request
      </h3>
    </section>
  </div>
</template>

<script lang="ts">
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
      dropDownActive: false,
      formError: false,
    }
  },
  setup() {
    const selectedProductPlacement = ref<productPlacementNamesType | null>(null);
    const selectPPName = (ppName: productPlacementNamesType | null) => {
      selectedProductPlacement.value = ppName
    }
    return {
      selectedProductPlacement,
      selectPPName,
    };
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
      type: Array as () => productRequestType[],
      required: true,
    },
    received: {
      type: Array as () => productRequestType[],
      required: true,
    },
    productPlacementNames: {
      type: Array as () => productPlacementNamesType[],
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    updateSentReq: {
      type: Function,
      required: true,
    },
    process_request: {
      type: Function,
      required: true
    }
  },
  methods: {

    checkRequest() {
      this.formError = false
      if (!this.selectedProductPlacement || !this.productId) {
        this.formError = true;
      } else {
        this.addProductRequest(this.productId, this.selectedProductPlacement.id);
      }
    },

    selectItem(ppName: productPlacementNamesType) {
      this.selectPPName(ppName);
      this.dropDownActive = false;
    },

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
    toggleDropdown() {
      this.dropDownActive = !this.dropDownActive;
    },
  },
  computed: {
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