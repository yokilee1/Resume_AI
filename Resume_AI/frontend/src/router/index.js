import { createRouter, createWebHistory } from 'vue-router';

// Import pages
import Home from '../pages/Home.vue';
import CreateResume from '../pages/CreateResume.vue';
import CompetitiveMatch from '../pages/CompetitiveMatch.vue';
import ResumeManagement from '../pages/ResumeManagement.vue';
import ResumeEdit from '../pages/ResumeEdit.vue';
import ResumeTemplates from '../pages/ResumeTemplates.vue';
import UserProfile from '../pages/UserProfile.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { hideLayout: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { hideLayout: true }
  },
  {
    path: '/create-resume',
    name: 'CreateResume',
    component: CreateResume,
  },
  {
    path: '/competitive-match',
    name: 'CompetitiveMatch',
    component: CompetitiveMatch,
  },
  {
    path: '/resume-management',
    name: 'ResumeManagement',
    component: ResumeManagement,
  },
  {
    path: '/resume/edit/:id',
    name: 'ResumeEdit',
    component: ResumeEdit,
    props: true,
  },
  {
    path: '/user-profile',
    name: 'UserProfile',
    component: UserProfile,
  },
  {
    path: '/resume-templates',
    name: 'ResumeTemplates',
    component: ResumeTemplates,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;