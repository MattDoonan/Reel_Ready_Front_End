<template>
  <!-- Main content template displaying project details and product placements -->
  <ion-page>
    <ion-content>
      <main>
        <section v-if="item" class="img-container project center-row">
          <ion-img alt="main image" :src="imageSrc"/>
        </section>
        <section v-if="item" class="project-content center-top-col">
          <!-- Project title and type -->
          <div class="left-col item-title">
            <h1 class="text-black">
              {{item.name}}
            </h1>
            <h4 class="text-dark-grey">
              {{item.type}}
            </h4>
            <!-- Project tags -->
            <div class="left-row container">
              <article class="restrictions" :key="index" v-for="(text, index) in item.tags">
                <p>
                  {{ text }}
                </p>
              </article>
            </div>
          </div>
          <!-- Project description -->
          <div class="left-col description" v-if="item.description">
            <h4 class="text-red">
              Description
            </h4>
            <p class="text-black description-text">
              {{item.description}}
            </p>
          </div>
          <!-- Product placement posts section -->
          <div class="product-placements left-col">
            <div class="space-apart-row">
              <h2 class="text-red">
                Product Placement Posts
              </h2>
              <button @click="togglePP(1)" class="left-row text-white crate-popup">
                Add a product placement
                <ion-img alt="plus" src="/svg/plus-white.svg"/>
              </button>
            </div>
            <product-placement :process_request="processRequest" :id="pp.product_placement_id" :name="pp.title" :description="pp.scene_description" :desired-item="pp.product_category" :requests="pp.product_requests" :key="index" v-for="(pp, index) in productPlacements"/>
          </div>
        </section>
        <!-- Add product placement form -->
        <AddProductPlacement v-if="item" :go-profile="goProfile" :update-p-p="updatePP" :item-id="project_id" :categories="categories" :toggle-active="togglePP" :is-active="ppActive"/>
        <ItemAdded :toggle-active="togglePP" text="Product placement added successfully" :is-active="ppActive"/>
      </main>
    </ion-content>
    <app-nav/>
  </ion-page>
</template>

<script lang="ts">

import {IonPage, IonContent, IonImg} from '@ionic/vue';
import {useRouter} from "vue-router";
import AppNav from "@/components/AppNav.vue";
import ProductPlacement from "@/components/ProductPlacement.vue";
import AddProductPlacement from "@/components/AddProductPlacement.vue";
import {ref} from "vue";
import axios from 'axios';
import {url, user_code} from "@/base_information";

import {ProductPlacementType, ProductType} from "@/types"
import ItemAdded from "@/components/ItemAdded.vue";

export default {
  data() {
    return {
      // Toggles the add product placement form
      ppActive: 0,
    }
  },
  components: {
    ItemAdded,
    AddProductPlacement,
    ProductPlacement,
    IonImg,
    AppNav,
    IonPage,
    IonContent
  },
  setup() {
    const router = useRouter();
    // The individual project
    const item = ref<ProductType>()
    // List of product placements relating to the project
    const productPlacements = ref<ProductPlacementType[]>([])
    // List of product categories
    const categories = ref([])
    // The project id gathered from the router
    const project_id: string = router.currentRoute.value.params.id.toString();

    /**
     * Updates the list of product placements.
     * @param {ProductPlacementType[]} newProductPlacements - The new product placements to be set.
     */
    const updatePP = (newProductPlacements: ProductPlacementType[]) => {
      productPlacements.value = newProductPlacements;
    }

    /**
     * Fetches project and product placement data from the API.
     */
    const getProduct = async () => {
      try {
        const response = await axios.get(url + `get_project/${project_id}/${user_code}`);
        const { project, product_placements } = response.data;
        if (!project) {
          await router.push('/explore');
        }
        item.value = project;
        productPlacements.value = product_placements;
      } catch (error) {
        console.error('Error fetching filters: ', error);
        await router.push('/profile');
      }
    };

    /**
     * Fetches product categories for filtering.
     */
    const fetchCategories = async () => {
      try {
        const response = await axios.get(url + 'explore-filters');
        categories.value = response.data
      } catch (error) {
        console.error('Error fetching filters: ', error);
      }
    };

    /**
     * Updates the response for a product request in a product placement.
     * @param {string} product_id - The product ID.
     * @param {string} product_placement_id - The product placement ID.
     * @param {string} newResponse - The new response for the request.
     */
    const updateProductRequest = (product_id: string, product_placement_id: string, newResponse: string) => {
      const productPlacement = productPlacements.value.find(item =>
          (placement:ProductPlacementType) => placement.product_placement_id === product_placement_id
      );
      if (productPlacement) {
        const productRequest = productPlacement.product_requests.find(
            (request) => request.product_id === product_id
        );
        if (productRequest) {
          productRequest.response = newResponse;
        }
      }
    }

    getProduct();
    fetchCategories();

    return { router, item, productPlacements, categories, project_id, updatePP, updateProductRequest };
  },
  computed: {
    /**
     * Returns the image source for the main project image.
     * @returns {string} The image source string.
     */
    imageSrc(): string {
      if (this.item)
      return `data:image/png;base64,${this.item.image}`;
      else {
        return ''
      }
    }
  },
  methods: {
    /**
     * Toggles the active state of product placement view.
     * @param {number} number - The new state to set.
     */
    togglePP(number: number) {
      this.ppActive = number;
    },
    /**
     * Redirects to the user profile page.
     */
    goProfile() {
      this.router.push('/profile')
    },

    /**
     * Processes a product request for a product placement.
     * @param {string} product_id - The product ID.
     * @param {string} product_placement_id - The product placement ID.
     * @param {string} outcome - The outcome of the request (e.g., approved or rejected).
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
  }
}
</script>