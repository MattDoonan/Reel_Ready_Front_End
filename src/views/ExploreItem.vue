<template>
  <!-- Main page structure containing the individual product details -->
  <ion-page>
    <ion-content>
      <main>
        <!-- Display the main image and sub images of the product -->
        <section v-if="item" class="img-container item center-row">
          <div class="main-img">
            <ion-img alt="main image" :src="images[imgIndex]"/>
          </div>
          <div class="right-col">
            <div class="sub-img" :key="index" v-for="(image, index) in filteredImages">
              <ion-img :src="image" :alt="item.title + 'image ' + index"/>
            </div>
          </div>
        </section>
        <!-- Product details including title, description, and price -->
        <section v-if="item" class="explore-item center-top-col">
          <div class="space-apart-row item-title">
            <div class="left-col">
              <h1 class="text-black">
                {{item.title}}
              </h1>
              <h4 class="text-dark-grey">
                {{item.brand_name}}
              </h4>
            </div>
            <div class="left-col">
              <label class="text-dark-grey">
                Got a production that fits the criteria?
              </label>
              <button @click="toggleForm" class="black">
                Request Product
              </button>
            </div>
          </div>
          <div class="space-apart-row description">
            <div class="left-col">
              <h4 class="text-red">
                Description
              </h4>
              <label class="text-dark-grey">
                {{'Category: ' + item.category_name}}
              </label>
              <p class="text-black description-text">
                {{item.description}}
              </p>
            </div>
            <div class="left-col right-side">
              <h4 class="text-red">
                Restrictions
              </h4>
              <label class="text-dark-grey">
                Prop cannot be apart of a scene or film that is:
              </label>
              <p>
                {{ item.restrictions }}
              </p>
              <h4 class="text-red price">
                Price
              </h4>
              <label class="text-dark-grey">
                The starting amount the company is prepared to allocate for product placement in the film
              </label>
              <h3>
                {{'$' + twodp}}
              </h3>
            </div>
          </div>
        </section>
        <!-- Related product search section -->
        <section class="related-searches">
          <h2 class="text-red">
            Related Searches
          </h2>
          <div class="left-row">
            <list-item :id="item.id.toString()" :image="item.files" :heading="item.title" link-heading="ExploreItem" :sub-heading="item.brand_name" :key="index" v-for="(item, index) in related_products"/>
          </div>
        </section>
        <product-request-form :process_request="processRequest" :update-sent-req="updateSentReq" :product-id="productId" :productPlacementNames="productPlacementNames" :received="received" :requests="delivered" :is-active="formActive" :toggle-active="toggleForm"/>
      </main>
    </ion-content>
    <app-nav/>
  </ion-page>
</template>

<script lang="ts">

import { IonPage, IonContent, IonImg } from '@ionic/vue';
import {useRouter} from "vue-router";
import AppNav from "@/components/AppNav.vue";
import ProductRequestForm from "@/components/ProductRequestForm.vue";
import axios from "axios";
import {ref} from "vue";
import {url, user_code} from "@/base_information";
import {productPlacementNamesType, productRequestType, productsExploreType, productType} from "@/types";
import ListItem from "@/components/ListItem.vue";
export default {
  data() {
    return {
      // Index of the currently displayed image
      imgIndex: 0,
      // Determines if the product request form is active
      formActive: false,
    }
  },
  components: {
    ListItem,
    ProductRequestForm,
    AppNav,
    IonPage,
    IonContent,
    IonImg,
  },
  setup() {
    const router = useRouter();
    // Holds the current product data
    const item = ref<productType>();
    // Holds the product placement names
    const productPlacementNames = ref<productPlacementNamesType[]>([])
    // Holds received product requests
    const received = ref<productRequestType[]>([]);
    // Holds sent product requests
    const delivered = ref<productRequestType[]>([]);
    // Product ID from route parameters
    const productId = router.currentRoute.value.params.id.toString()
    // Holds related products data
    const related_products = ref<productsExploreType[]>([]);

    /**
     * Updates the list of sent product requests.
     * @param {productRequestType[]} newRequest - New product requests to update.
     */
    const updateSentReq = (newRequest:productRequestType[]) => {
      delivered.value = newRequest;
    }

    /**
     * Fetches product placement names from the API.
     * @param {productType} product - The product for which to fetch placement names.
     */
    const getProductPlacements = async (product: productType) => {
      try {
        if (!product) return;
        const ppNames = await axios.get(`${url}get_product_placement_names/${user_code}/${product.category_name}`);
        productPlacementNames.value = ppNames.data;
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    }

    /**
     * Fetches related products from the API.
     */
    const getRelatedProducts = async () => {
      try {
        const response = await axios.get(`${url}get_related_products/${productId}`);
        related_products.value = response.data
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    }

    /**
     * Fetches the product data, including details, requests, and related products.
     */
    const getProduct = async () => {
      try {
        const response = await axios.get(url + `get_single_product/${productId}/${user_code}`);
        const { product, sent_requests, received_requests } = response.data;
        if (!product) {
          await router.push('/explore');
        }
        item.value = product;
        delivered.value = sent_requests;
        received.value = received_requests;
        await getProductPlacements(product);
        await getRelatedProducts();
      } catch (error) {
        console.error('Error fetching data: ', error);
        await router.push('/explore');
      }
    }

    /**
     * Updates the response of a product request.
     * @param {string} product_id - The ID of the product.
     * @param {string} product_placement_id - The ID of the product placement.
     * @param {string} newResponse - The new response for the request.
     */
    const updateProductRequest = (product_id: string, product_placement_id: string, newResponse: string) => {
      const product = received.value.find(item =>
          item.product_id === product_id && item.product_placement_id === product_placement_id
      );
      if (product) {
        product.response = newResponse
      }
    }

    // Initial call to fetch product data
    getProduct();
    return { router, item, received, delivered, productPlacementNames, productId, updateSentReq, updateProductRequest, related_products };
  },
  computed: {
    /**
     * Returns a filtered list of images, excluding the current image index.
     */
    filteredImages() {
      const list = this.images.slice(0, 3)
      list.splice(this.imgIndex, this.imgIndex + 1)
      return list;
    },
    /**
     * Returns the list of images for the current product.
     */
    images(): string[] {
      if (this.item) {
        const imgs: string[] = [];
        for (let i in this.item.files) {
          imgs.push(`data:image/png;base64,${this.item.files[i]}`)
        }
        return imgs;
      }
      return []
    },
    /**
     * Returns the formatted price with two decimal places.
     */
    twodp(): string {
      if (this.item) {
        if (this.item.price !== undefined && this.item.price !== null) {
          return this.item.price.toFixed(2);
        }
      }
      return "0.00";
    }
  },
  methods: {
    /**
     * Toggles the visibility of the product request form.
     */
    toggleForm() {
      this.formActive = !this.formActive
    },

    /**
     * Processes a product request and updates its response.
     * @param {string} product_id - The ID of the product.
     * @param {string} product_placement_id - The ID of the product placement.
     * @param {string} outcome - The outcome of the request (accepted, declined).
     */
    async processRequest(product_id: string, product_placement_id:string, outcome: string) {
      try {
        const response = await axios.post(url + `process_set_designer_incoming_request/${user_code}`, {
          product_id: product_id,
          product_placement_id: product_placement_id,
          outcome: outcome
        });
        if (response.status === 201) {
          this.updateProductRequest(product_id, product_placement_id, outcome)
        } else {
          console.log("Error processing request")
        }
      } catch (error) {
        console.log("Error processing request")
      }
    },
  },

}
</script>