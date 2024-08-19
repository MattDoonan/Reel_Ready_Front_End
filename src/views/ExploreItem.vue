<template>
  <ion-page>
    <ion-content>
      <main>
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
              <div class="left-row">
                <article class="restrictions">
                  <p>
                    {{ item.restrictions }}
                  </p>
                </article>
              </div>
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
        <product-request-form :received="received" :requests="delivered" :is-active="formActive" :toggle-active="toggleForm"/>
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
export default {
  data() {
    return {
      imgIndex: 0,
      formActive: false,
    }
  },
  components: {
    ProductRequestForm,
    AppNav,
    IonPage,
    IonContent,
    IonImg,
  },
  setup() {
    const router = useRouter();
    const item = ref([])
    const received = ref([])
    const delivered = ref([])
    const getProduct = async () => {
      try {
        const response = await axios.get(url + `get_single_product/${router.currentRoute.value.params.id}/${user_code}`);
        const { product, sent_requests, received_requests } = response.data;
        if (!product) {
          await router.push('/explore');
        }
        item.value = product;
        delivered.value = sent_requests;
        received.value = received_requests;
      } catch (error) {
        console.error('Error fetching filters: ', error);
        await router.push('/explore');
      }
    }
    getProduct();
    return { router, item, received, delivered };
  },
  computed: {
    filteredImages() {
      const list = this.images.slice(0, 3)
      list.splice(this.imgIndex, this.imgIndex + 1)
      return list;
    },
    images(): string[] {
      const imgs: string[] = [];
      for (let i in this.item.files) {
        imgs.push(`data:image/png;base64,${this.item.files[i]}`)
      }
      return imgs;
    },
    twodp(): number {
      if (this.item.price !== undefined && this.item.price !== null) {
        return this.item.price.toFixed(2);
      }
      else {
        this.item.price
      }
    }
  },
  methods: {
    toggleForm() {
      this.formActive = !this.formActive
    },
  },

}
</script>