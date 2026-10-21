
import { createRouter, createWebHistory } from "@ionic/vue-router";
import type { RouteRecordRaw } from "vue-router";
import { supabase } from "@/lib/supabaseClient";
import LoginPage from "@/views/LoginPage.vue";
import CadastroPage from "@/views/CadastroPage.vue";
import RecuperarSenhaPage from "@/views/RecuperarSenhaPage.vue";
import NovaSenhaPage from "@/views/NovaSenhaPage.vue";
import TabsPage from "@/views/TabsPage.vue";
import InicioPage from "@/views/HomePage.vue";
import PerfilPage from "@/views/PerfilPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: LoginPage,
  },
  {
    path: "/cadastro",
    component: CadastroPage,
  },
  {
    path: "/recuperar-senha",
    component: RecuperarSenhaPage,
  },
  {
    path: "/nova-senha",
    component: NovaSenhaPage,
  },
  {
    path: "/tabs",
    component: TabsPage,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        redirect: "/tabs/inicio",
      },
      {
        path: "inicio",
        component: InicioPage,
      },
      {
        path: "perfil",
        component: PerfilPage,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  const { data, error } = await supabase.auth.getSession();
  if (error && to.matched.some((record) => record.meta.requiresAuth)) {
    return "/login";
  }

  const autenticado = !!data.session;

  const precisaLogin = to.matched.some(
    (record) => record.meta.requiresAuth,
  );

  if (precisaLogin && !autenticado) {
    return {
      path: "/login",
      query: { redirect: to.fullPath },
    };
  }

  return true;
});

export default router;
