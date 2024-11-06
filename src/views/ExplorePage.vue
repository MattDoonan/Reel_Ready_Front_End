<template>
  <!-- Main page structure containing a list of discoverable products with infinite scroll -->
  <ion-page>
    <ion-content>
      <main>
        <section class="explore-items">
          <div class="explore-search">
            <!-- Search bar for filtering products by name -->
            <div class="input-search">
              <ion-img alt="search icon" src="/svg/search-icon.svg"/>
              <input v-model="toSearch" @input="inputHandler" type="text"/>
            </div>
            <div class="left-row">
              <!-- Dropdown for selecting product category filters -->
              <div class="dropdown">
                <button @click="togglePC" class="left-row text-black">
                  {{activeFilter === "" ? "Product Category" : activeFilter}}
                  <ion-img :style="{ transform: pcActive ? 'rotate(180deg)' : 'none' }" alt="arrow down" src="/svg/down-arrow.svg"/>
                </button>
                <div v-if="pcActive">
                  <button v-if="activeFilter !== ''" class="text-black" @click="removeFilter">
                    No Filter
                  </button>
                  <button class="text-black" @click="selectFilter(filter)" :key="index" v-for="(filter, index) in filters">
                    {{filter}}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- Infinite scroll for loading more products -->
          <ion-infinite-scroll @ionInfinite="ionInfinite" class="grid">
              <list-item :id="item.id.toString()" :image="item.files" :heading="item.title" link-heading="ExploreItem" :sub-heading="item.brand_name" :key="index" v-for="(item, index) in products"/>
          </ion-infinite-scroll>
        </section>
      </main>
    </ion-content>
    <app-nav/>
  </ion-page>
</template>

<script lang="ts">

import {ref} from "vue";
import {url} from "@/base_information";

import {IonPage, IonContent, IonImg, IonInfiniteScroll, IonInfiniteScrollContent, InfiniteScrollCustomEvent} from '@ionic/vue';
import {useRouter} from "vue-router";
import AppNav from "@/components/AppNav.vue";
import ListItem from "@/components/ListItem.vue";
import axios from 'axios';
import {productsExploreType} from "@/types";

export default {
  data() {
    return {
      // Controls the visibility of the product category dropdown
      pcActive: false,
    }
  },
  components: {
    ListItem,
    AppNav,
    IonPage,
    IonContent,
    IonImg,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  },
  setup() {
    // Vue Router instance for navigation
    const router = useRouter();
    // List of available filters for product categories
    const filters = ref<string[]>([]);
    // Currently active filter for products
    const activeFilter = ref<string>("");
    // List of fetched products
    const products = ref<productsExploreType[]>([]);
    // Number of items loaded for infinite scroll
    const itemsLoaded = ref<number>(0);
    // Search query string
    const toSearch = ref<string>("");
    // Flag indicating if no more products should be loaded
    const noLoad = ref<boolean>(false);


    /**
     * Fetches the available filters for product categories from the server.
     */
    const fetchFilters = async () => {
      try {
        const response = await axios.get(url + 'explore-filters');
        filters.value = response.data
      } catch (error) {
        console.error('Error fetching filters: ', error);
      }
    }

    /**
     * Fetches the list of products based on the search query and active filter.
     *
     * @param toLoad - Number of products to load.
     * @param reset - Whether to reset the current products list for a new one.
     */
    const fetchProducts = async (toLoad:number, reset:boolean) => {
      try {
        let endpoint =  url + `get_products/${toLoad}`
        if (toSearch.value !== "") {
          endpoint  = endpoint + `?search=${toSearch.value}`
          if (activeFilter.value !== "") {
            endpoint  = endpoint + `&filter=${activeFilter.value}`
          }
        } else if (activeFilter.value !== "") {
          endpoint  = endpoint + `?filter=${activeFilter.value}`
        }
        const response = await axios.get(endpoint);
        if (reset) {
          noLoad.value = false
          products.value = response.data
        } else {
          if(response.data.length === 0) {
            noLoad.value = true;
          }
          products.value.push(...response.data)
        }
      } catch (error) {
        console.error('Error fetching filters: ', error);
      }
    }

    /**
     * Handles the infinite scroll event and loads more products if necessary.
     *
     * @param ev - The custom event triggered by the infinite scroll.
     */
    const ionInfinite = (ev: InfiniteScrollCustomEvent) => {
      if (!noLoad.value) {
        itemsLoaded.value = itemsLoaded.value + 1
        fetchProducts(itemsLoaded.value, false);
      }
      setTimeout(() => ev.target.complete(), 500)
    };

    /**
     * Handles input changes in the search field and triggers a product fetch.
     */
    const inputHandler = () => {
      itemsLoaded.value = 0
      fetchProducts(itemsLoaded.value, true);
    };


    /**
     * Removes the active filter and resets the products list.
     */
    const noFilter = () => {
      itemsLoaded.value = 0
      activeFilter.value = "";
      fetchProducts(itemsLoaded.value, true);
    }


    /**
     * Changes the active filter and fetches the filtered products.
     *
     * @param filter - The filter to apply.
     */
    const changeFilter = (filter:string) => {
      itemsLoaded.value = 0;
      activeFilter.value = filter;
      fetchProducts(itemsLoaded.value, true);
    }

    fetchFilters();
    fetchProducts(itemsLoaded.value, true);
    return { router, products, filters, ionInfinite, toSearch, inputHandler, noFilter, changeFilter, activeFilter};
  },
  methods: {
    /**
     * Toggles the visibility of the product category dropdown.
     */
    togglePC() {
      this.pcActive = !this.pcActive;
    },

    /**
     * Selects a filter from the dropdown and applies it.
     *
     * @param filter - The selected filter.
     */
    selectFilter(filter:string) {
      this.pcActive = false;
      this.changeFilter(filter)
    },

    /**
     * Removes the current filter and resets the product list.
     */
    removeFilter() {
      this.pcActive = false;
      this.noFilter()
    }
  },
}
</script>