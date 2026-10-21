
<template>
  <ion-page>
    <ion-content :fullscreen="true" class="app-content">
      <ion-grid class="page-grid">
        <ion-row class="ion-justify-content-center ion-align-items-center">
          <ion-col size="12" size-sm="10" size-md="7" size-lg="5">
            <ion-card class="app-card">
              <ion-card-header class="ion-text-center">
                <ion-icon :icon="keyOutline" class="brand-icon" />

                <ion-card-title class="app-heading">
                  Recuperar senha
                </ion-card-title>

                <ion-card-subtitle class="app-description">
                  Informe seu e-mail para receber o link de recuperação.
                </ion-card-subtitle>
              </ion-card-header>

              <ion-card-content>
                <ion-list lines="none">
                  <ion-item class="app-field">
                    <ion-icon :icon="mailOutline" slot="start" />
                    <ion-input
                      v-model="email"
                      label="E-mail cadastrado"
                      label-placement="stacked"
                      type="email"
                      placeholder="seuemail@exemplo.com"
                      autocomplete="email"
                      required
                    />
                  </ion-item>
                </ion-list>

                <ion-text v-if="erro" color="danger">
                  <ion-item lines="none" class="message-item">
                    <ion-icon :icon="alertCircleOutline" slot="start" />
                    <ion-label class="ion-text-wrap">
                      {{ erro }}
                    </ion-label>
                  </ion-item>
                </ion-text>

                <ion-text v-if="sucesso" color="success">
                  <ion-item lines="none" class="message-item">
                    <ion-icon :icon="checkmarkCircleOutline" slot="start" />
                    <ion-label class="ion-text-wrap">
                      {{ sucesso }}
                    </ion-label>
                  </ion-item>
                </ion-text>

                <ion-button
                  expand="block"
                  class="app-button"
                  :disabled="carregando"
                  @click="enviarLink"
                >
                  <ion-spinner v-if="carregando" name="crescent" />
                  <ion-text v-else>Enviar link</ion-text>
                </ion-button>

                <ion-button
                  expand="block"
                  fill="clear"
                  class="back-button"
                  @click="router.replace('/login')"
                >
                  <ion-icon :icon="arrowBackOutline" slot="start" />
                  Voltar ao login
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
import { useRouter } from "vue-router";

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
  IonIcon,
  IonItem,
  IonList,
  IonInput,
  IonButton,
  IonText,
  IonLabel,
  IonSpinner,
} from "@ionic/vue";

import {
  keyOutline,
  mailOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
  arrowBackOutline,
} from "ionicons/icons";

import { recuperarSenha } from "@/services/supabaseService";

const router = useRouter();

const email = ref("");
const carregando = ref(false);
const erro = ref("");
const sucesso = ref("");

async function enviarLink() {
  erro.value = "";
  sucesso.value = "";

  if (!email.value.trim()) {
    erro.value = "Digite o e-mail cadastrado.";
    return;
  }

  carregando.value = true;

  try {
    await recuperarSenha(email.value);

    sucesso.value =
      "Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.";
  } catch (error: unknown) {
    erro.value =
      error instanceof Error
        ? error.message
        : "Não foi possível enviar o link de recuperação.";
  } finally {
    carregando.value = false;
  }
}
</script>

<style scoped>
.page-grid {
  min-height: 100%;
  display: flex;
  align-items: center;
}

.app-card {
  margin: 16px;
  border-radius: 24px;
}

.brand-icon {
  display: block;
  margin: 18px auto;
  font-size: 54px;
  color: var(--ion-color-primary);
}

.app-heading {
  font-size: 25px;
  font-weight: 800;
  color: var(--ion-color-primary);
}

.app-description {
  margin-top: 10px;
  line-height: 1.6;
}

.app-field {
  margin: 18px 0;
  --border-radius: 14px;
  --background: #f1f5fb;
  --padding-start: 12px;
}

.app-button {
  margin-top: 20px;
  min-height: 48px;
  font-weight: 700;
  text-transform: none;
}

.back-button {
  margin-top: 12px;
  text-transform: none;
}

.message-item {
  --background: transparent;
  font-size: 14px;
}
</style>
