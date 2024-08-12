<template>
  <ion-page>
    <ion-content>
      <main>
        <section v-if="item" class="img-container item center-row">
          <div class="main-img">
            <ion-img alt="main image" :src="item.images[imgIndex]"/>
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
                {{item.brand}}
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
                {{'Category: ' + item.category}}
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
                <article class="restrictions" :key="index" v-for="(text, index) in item.restrictions">
                  <p>
                    {{ text }}
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
                {{'$' + item.price.toFixed(2)}}
              </h3>
            </div>
          </div>
        </section>
        <product-request-form :received="item.received" :requests="item.requests" :is-active="formActive" :toggle-active="toggleForm"/>
      </main>
    </ion-content>
    <app-nav/>
  </ion-page>
</template>

<script lang="ts">

import { IonPage, IonContent } from '@ionic/vue';
import {useRouter} from "vue-router";
import AppNav from "@/components/AppNav.vue";
import ProductRequestForm from "@/components/ProductRequestForm.vue";
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
    IonContent
  },
  setup() {
    const router = useRouter();
    const item = {
      images: ['/test/chair.png', '/test/chair.png', '/test/chair.png'],
      title: 'White fancy armchair',
      brand: 'Europlan',
      category: 'Chair',
      description: 'Upgrade your workspace with the White fancy armchair, the ultimate blend of comfort, style, and functionality. Designed with the modern professional in mind, this chair offers unparalleled support to keep you productive and comfortable throughout the day.\n' +
          '\n' +
          'The White fancy armchair is more than just a seating solution; it’s an investment in your well-being and productivity. Whether you’re working from home or in a corporate environment, this chair is designed to support you throughout your busiest days. Say goodbye to discomfort and hello to a more enjoyable work experience with the White fancy armchair.\n' +
          '\n' +
          'Dimensions:\n' +
          '\n' +
          'Seat Width: 20 inches \n' +
          'Seat Depth: 18 inches \n' +
          'Backrest Height: 24 inches\n' +
          'Adjustable Height Range: 18 to 22 inches',
      restrictions: ['R16', 'Horror', 'Thriller', 'Death Scene', 'Blood Scene'],
      price: 200,
      requests: [{image: '/test/joker.png', name: 'Joker and Harley Quinn Dance Scene', description: 'Amid the chaos of a riot in Gotham Central, The Joker and Harley Quinn dance together.', status: 'Pending'}],
      received: [{image: '/test/joker.png', name: 'Joker and Harley Quinn Riot Scene', description: 'Amid the chaos of a riot in Gotham Central, The Joker and Harley Quinn dance together.', status: 'Requested'}],
    }
    if (item == null) {
      router.push('/explore');
    }
    return { router, item };
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    filteredImages() {
      const list = this.item.images.slice(0, 3)
      list.splice(this.imgIndex, this.imgIndex + 1)
      return list;
    }
  },
  methods: {
    toggleForm() {
      this.formActive = !this.formActive
    }
  }
}
</script>