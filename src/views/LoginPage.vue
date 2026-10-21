
<template>
  <ion-page>
    <ion-content :fullscreen="true" class="app-content">
      <ion-grid class="login-grid">
        <ion-row class="ion-justify-content-center ion-align-items-center">
          <ion-col size="12" size-sm="10" size-md="7" size-lg="5">
            <ion-card class="app-card">
              <ion-card-header class="ion-text-center">
                <ion-icon :icon="lockClosedOutline" class="brand-icon" />

                <ion-card-title class="app-heading">
                  Bem-vindo de volta!
                </ion-card-title>

                <ion-card-subtitle class="app-description">
                  Entre na sua conta para continuar.
                </ion-card-subtitle>
              </ion-card-header>

              <ion-card-content>
                <ion-list lines="none">
                  <ion-item class="app-field">
                    <ion-icon :icon="mailOutline" slot="start" />
                    <ion-input
                      v-model="email"
                      label="E-mail"
                      label-placement="stacked"
                      type="email"
                      placeholder="Digite seu e-mail"
                      autocomplete="email"
                      required
                    />
                  </ion-item>

                  <ion-item class="app-field">
                    <ion-icon :icon="lockClosedOutline" slot="start" />
                    <ion-input
                      v-model="senha"
                      label="Senha"
                      label-placement="stacked"
                      :type="mostrarSenha ? 'text' : 'password'"
                      placeholder="Digite sua senha"
                      autocomplete="current-password"
                      required
                    />

                    <ion-button
                      slot="end"
                      fill="clear"
                      color="medium"
                      :aria-label="mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'"
                      @click="mostrarSenha = !mostrarSenha"
                    >
                      <ion-icon
                        :icon="mostrarSenha ? eyeOffOutline : eyeOutline"
                      />
                    </ion-button>
                  </ion-item>
                </ion-list>

                <ion-button
                  expand="block"
                  fill="clear"
                  class="forgot-button"
                  @click="router.push('/recuperar-senha')"
                >
                  Esqueci minha senha
                </ion-button>

                <ion-text v-if="erro" color="danger">
                  <ion-item lines="none" class="message-item">
                    <ion-icon :icon="alertCircleOutline" slot="start" />
                    <ion-label class="ion-text-wrap">
                      {{ erro }}
                    </ion-label>
                  </ion-item>
                </ion-text>

                <ion-button
                  expand="block"
                  class="app-button"
                  :disabled="carregando"
                  @click="entrar"
                >
                  <ion-spinner v-if="carregando" name="crescent" />
                  <ion-text v-else>Entrar</ion-text>
                </ion-button>

                <ion-item lines="none" class="register-item">
                  <ion-label class="ion-text-center">
                    Ainda não tem uma conta?
                  </ion-label>
                </ion-item>

                <ion-button
                  expand="block"
                  fill="outline"
                  class="secondary-button"
                  @click="router.push('/cadastro')"
                >
                  Criar conta
                </ion-button>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonList,
  IonInput,
  IonButton,
  IonIcon,
  IonText,
  IonLabel,
  IonSpinner,
} from "@ionic/vue";

import {
  lockClosedOutline,
  mailOutline,
  eyeOutline,
  eyeOffOutline,
  alertCircleOutline,
} from "ionicons/icons";

import { loginUsuario } from "@/services/supabaseService";

const router = useRouter();
const route = useRoute();

const email = ref("");
const senha = ref("");
const mostrarSenha = ref(false);
const carregando = ref(false);
const erro = ref("");

async function entrar() {
  erro.value = "";

  if (!email.value.trim() || !senha.value) {
    erro.value = "Preencha o e-mail e a senha.";
    return;
  }

  carregando.value = true;

  try {
    await loginUsuario(email.value, senha.value);

    const destino = route.query.redirect;

    const caminho =
      typeof destino === "string" &&
      destino.startsWith("/") &&
      !destino.startsWith("//") &&
      !destino.startsWith("/login")
        ? destino
        : "/tabs/inicio";

    await router.replace(caminho);
  } catch (error: unknown) {
    erro.value =
      error instanceof Error
        ? error.message
        : "Não foi possível entrar. Confira seus dados.";
  } finally {
    carregando.value = false;
  }
}
</script>

<style scoped>
.login-grid {
  min-height: 100%;
  display: flex;
  align-items: center;
}

.app-card {
  margin: 16px;
  border-radius: 24px;
}

.brand-icon {
  font-size: 54px;
  color: var(--ion-color-primary);
  margin: 12px auto 20px;
}

.app-heading {
  font-size: 25px;
  font-weight: 800;
  color: var(--ion-color-primary);
}

.app-description {
  margin-top: 10px;
  line-height: 1.5;
}

.app-field {
  margin: 12px 0;
  --border-radius: 14px;
  --background: #f1f5fb;
  --padding-start: 12px;
  --inner-padding-end: 8px;
}

.forgot-button {
  margin: 8px 0 18px;
  font-size: 13px;
  text-transform: none;
}

.app-button,
.secondary-button {
  margin-top: 12px;
  min-height: 48px;
  font-weight: 700;
  text-transform: none;
}

.register-item {
  margin-top: 22px;
  --background: transparent;
  color: var(--ion-color-medium);
  font-size: 14px;
}

.message-item {
  --background: transparent;
  font-size: 14px;
}
</style>
