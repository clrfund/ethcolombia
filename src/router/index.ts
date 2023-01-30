import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
const Leaderboard = () => import('@/views/Leaderboard.vue')
const Landing = () => import('@/views/Landing.vue')
const About = () => import('@/views/About.vue')
const Project = () => import('@/views/Project.vue')
const RoundInformation = () => import('@/components/RoundInformation.vue')
const AboutMaci = () => import('@/views/AboutMaci.vue')
const AboutSybilResistance = () => import('@/views/AboutSybilResistance.vue')
const AboutLayer2 = () => import('@/views/AboutLayer2.vue')
const AboutHowItWorks = () => import('@/views/AboutHowItWorks.vue')
const AboutContributors = () => import('@/views/AboutContributors.vue')
const AboutRecipients = () => import('@/views/AboutRecipients.vue')
const AboutPublicGoods = () => import('@/views/AboutPublicGoods.vue')
const AboutDecentralization = () => import('@/views/AboutDecentralization.vue')
const AboutQuadraticFunding = () => import('@/views/AboutQuadraticFunding.vue')

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'landing',
    component: Landing,
    meta: {
      title: 'Clr.fund',
    },
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    meta: {
      title: 'About',
    },
  },
  {
    path: '/projects/:id',
    name: 'project',
    component: Project,
  },
  {
    path: '/projects',
    name: 'projects',
    component: Leaderboard,
    meta: {
      title: 'Leaderboard',
    },
  },
  {
    path: '/round-information',
    name: 'round-information',
    component: RoundInformation,
    meta: {
      title: 'Round Information',
    },
  },
  {
    path: '/about/maci',
    name: 'about-maci',
    component: AboutMaci,
    meta: {
      title: 'About MACI',
    },
  },
  {
    path: '/about/sybil-resistance',
    name: 'about-sybil-resistance',
    component: AboutSybilResistance,
    meta: {
      title: 'About Sybil Resistance',
    },
  },
  {
    path: '/about/layer-2/:section?',
    name: 'about-layer-2',
    component: AboutLayer2,
    meta: {
      title: 'About Layer 2',
    },
  },
  {
    path: '/about/how-it-works',
    name: 'about-how-it-works',
    component: AboutHowItWorks,
    meta: {
      title: 'How it works',
    },
  },
  {
    path: '/about/how-it-works/contributors',
    name: 'about-how-it-works-contributors',
    component: AboutContributors,
    meta: {
      title: 'Contributors Guide',
    },
  },
  {
    path: '/about/how-it-works/recipients',
    name: 'about-how-it-works-recipients',
    component: AboutRecipients,
    meta: {
      title: 'Recipients Guide',
    },
  },
  {
    path: '/about/public-goods',
    name: 'about-public-goods',
    component: AboutPublicGoods,
    meta: {
      title: 'About public goods',
    },
  },
  {
    path: '/about/quadratic-funding',
    name: 'about-quadratic-funding',
    component: AboutQuadraticFunding,
    meta: {
      title: 'About quadratic funding',
    },
  },
  {
    path: '/about/decentralization',
    name: 'about-decentralization',
    component: AboutDecentralization,
    meta: {
      title: 'About decentralization',
    },
  },
]

const router = createRouter({
  // https://router.vuejs.org/guide/essentials/history-mode.html#html5-mode
  // use hash mode to avoid handling 404 error for github pages
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
