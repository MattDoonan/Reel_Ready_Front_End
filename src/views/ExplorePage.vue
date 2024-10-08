<template>
  <ion-page>
    <ion-content>
      <main>
        <section class="explore-items">
          <div class="explore-search">
            <div class="input-search">
              <ion-img alt="search icon" src="/svg/search-icon.svg"/>
              <input v-model="toSearch" @input="inputHandler" type="text"/>
            </div>
            <div class="left-row">
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
    const router = useRouter();
    const filters = ref<string[]>([]);
    const activeFilter = ref<string>("");
    const products = ref<productsExploreType[]>([]);
    const itemsLoaded = ref<number>(0);
    const toSearch = ref<string>("");
    const noLoad = ref<boolean>(false);

    const fetchFilters = async () => {
      try {
        const response = await axios.get(url + 'explore-filters');
        filters.value = response.data
      } catch (error) {
        console.error('Error fetching filters: ', error);
      }
    }
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
    const ionInfinite = (ev: InfiniteScrollCustomEvent) => {
      if (!noLoad.value) {
        itemsLoaded.value = itemsLoaded.value + 1
        fetchProducts(itemsLoaded.value, false);
      }
      setTimeout(() => ev.target.complete(), 500)
    };
    const inputHandler = () => {
      itemsLoaded.value = 0
      fetchProducts(itemsLoaded.value, true);
    };

    const noFilter = () => {
      itemsLoaded.value = 0
      activeFilter.value = "";
      fetchProducts(itemsLoaded.value, true);
    }

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
    togglePC() {
      this.pcActive = !this.pcActive;
    },
    selectFilter(filter:string) {
      this.pcActive = false;
      this.changeFilter(filter)
    },
    removeFilter() {
      this.pcActive = false;
      this.noFilter()
    }
  },
}
</script>