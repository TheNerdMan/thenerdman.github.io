import { createMemoryHistory, createRouter, type RouteRecordRaw } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import ToolsView from '@/views/ToolsView.vue';
import BlogView from '@/views/BlogView.vue';
import PlaygroundView from '@/views/PlaygroundView.vue';
import TresView from '@/views/Playground/TresView.vue';

export const ROUTE_NAMES = {
  HOME: 'home',
  TOOLS: 'tools',
  BLOG: 'blog',
  BLOG_POST: 'blog-post',
  PLAYGROUND: 'playground',
  PLAYGROUND_TRES: 'playground-tres',
  NOT_FOUND: 'not-found',
};

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: ROUTE_NAMES.HOME,
    component: HomeView,
  },
  {
    path: '/:pathMatch(.*)*',
    name: ROUTE_NAMES.NOT_FOUND,
    redirect: '/',
  },
  {
    path: '/tools',
    name: ROUTE_NAMES.TOOLS,
    component: ToolsView,
  },
  {
    path: '/blog',
    name: ROUTE_NAMES.BLOG,
    component: BlogView,
  },
  {
    path: '/blog/:slug',
    name: ROUTE_NAMES.BLOG_POST,
    component: BlogView,
  },
  {
    path: '/playground',
    name: ROUTE_NAMES.PLAYGROUND,
    component: PlaygroundView,
  },
  {
    path: '/playground/tres',
    name: ROUTE_NAMES.PLAYGROUND_TRES,
    component: TresView,
  },
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
