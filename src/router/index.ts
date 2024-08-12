import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import ExplorePage from '../views/ExplorePage.vue'
import ProfilePage from "../views/ProfilePage.vue";
import ExploreItem from "../views/ExploreItem.vue";
import ProjectPage from "../views/ProjectPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/explore'
  },
  {
    path: '/explore',
    name: 'Explore',
    component: ExplorePage,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
  },
  {
    path: '/explore/item/:id',
    name: 'ExploreItem',
    component: ExploreItem,
  },
  {
    path: '/project/:id',
    name: 'Project',
    component: ProjectPage,
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
