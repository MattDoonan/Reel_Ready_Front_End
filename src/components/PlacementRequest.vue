<template>
  <!--
    This component represents a product request card where the set designer can accept or decline
    requests for products. It displays an image, title, subtitle, and the current status of the request.
  -->
  <div class="left-row request">

    <!-- Request information -->
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
      <!-- Active if the request is pending to the set designer -->
      <div class="left-row" v-if="status == 'pending' && sentTo == 'set_designer'">
        <button @click="process_request(product_id, product_placement_id, 'accepted')" class="black-small">
          Accept
        </button>
        <button class="red-small" @click="process_request(product_id, product_placement_id, 'declined')">
          Decline
        </button>
      </div>

      <!-- Active if the request is pending to the brand manager -->
      <span class="grey-border-small" v-if="status == 'pending' && sentTo == 'brand_manager'">
        Pending...
      </span>

      <!-- Active if the request has been accepted by either party -->
      <span class="black-border-small" v-if="status == 'accepted'">
        Accepted
      </span>

      <!-- Active if the request has been declined by either party -->
      <span class="red-border-small" v-if="status == 'declined'">
        Declined
      </span>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * A component that displays a product request for a set designer or brand manager.
 * It shows an image, title, subtitle, and status of the request. If the request is
 * pending and sent to a set designer, the component provides options to accept or
 * decline the request. If the request is pending and sent to a brand manager,
 * it shows a "Pending..." message.
 *
 * @component
 * @example
 * <ProductRequest
 *   :image="productImage"
 *   :title="productTitle"
 *   :subTitle="productSubTitle"
 *   :status="requestStatus"
 *   :sentTo="sentToUser"
 *   :product_id="123"
 *   :product_placement_id="456"
 *   :process_request="handleRequest"
 * />
 */

import {IonImg} from "@ionic/vue";

export default {
  data() {
    return {
      requestsShow: false,
    }
  },
  props: {
    /**
     * The base64 encoded image for the product.
     */
    image: {
      type: String,
      required: true,
    },

    /**
     * The title of the product request.
     */
    title: {
      type: String,
      required: true,
    },

    /**
     * The subtitle or description for the request.
     */
    subTitle: {
      type: String,
      required: true,
    },

    /**
     * The current status of the request (e.g., 'pending', 'accepted', 'declined').
     */
    status: {
      type: String,
      required: true,
    },

    /**
     * The recipient of the request (either 'set_designer' or 'brand_manager').
     */
    sentTo: {
      type: String,
      required: true,
    },

    /**
     * The unique identifier of the product.
     */
    product_id: {
      type: [String, Number],
      required: true,
    },

    /**
     * The unique identifier of the product placement.
     */
    product_placement_id: {
      type: [String, Number],
      required: true,
    },

    /**
     * Function to process the request (accept or decline).
     */
    process_request: {
      type: Function,
      required: true
    }
  },
  computed: {
    /**
     * Returns the image source as a base64 encoded image string.
     * @returns {String} The formatted image source.
     */
    imageSrc(): string {
      return `data:image/png;base64,${this.image}`;
    }
  },
  components: {
    IonImg
  },
}
</script>