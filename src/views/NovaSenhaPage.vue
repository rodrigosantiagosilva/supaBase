
<template>
  <ion-page>
    <ion-content :fullscreen="true" class="app-content">
      <ion-grid class="page-grid">
        <ion-row class="ion-justify-content-center ion-align-items-center">
          <ion-col size="12" size-sm="10" size-md="7" size-lg="5">
            <ion-card class="app-card">
              <ion-card-header class="ion-text-center">
                <ion-icon :icon="lockClosedOutline" class="brand-icon" />

                <ion-card-title class="app-heading">
                  Nova senha
                </ion-card-title>

                <ion-card-subtitle class="app-description">
                  Escolha uma nova senha para sua conta.
                </ion-card-subtitle>
              </ion-card-header>

              <ion-card-content>
                <ion-list lines="none">
                  <ion-item class="app-field">
                    <ion-icon :icon="lockClosedOutline" slot="start" />

                    <ion-input
                      v-model="senha"
                      label="Nova senha"
                      label-placement="stacked"
                      :type="mostrarSenha ? 'text' : 'password'"
                      placeholder="Mínimo de 6 caracteres"
                      autocomplete="new-password"
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

                  <ion-item class="app-field">
                    <ion-icon :icon="shieldCheckmarkOutline" slot="start" />

                    <ion-input
                      v-model="confirmarSenha"
                      label="Confirmar nova senha"
                      label-placement="stacked"
                      type="password"
                      placeholder="Digite a senha novamente"
                      autocomplete="new-password"
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

                <ion-button
                  expand="block"
                  class="app-button"
                  :disabled="carregando"
                  @click="salvarSenha"
                >
                  <ion-spinner v-if="carregando" name="crescent" />
                  <ion-text v-else>Salvar nova senha</ion-text>
                </ion-button>

                <ion-button
                  expand="block"
                  fill="clear"
                  class="back-button"
                  @click="router.replace('/login')"
                >
                  Voltar ao login
                </ion-button>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-alert
        :is-open="mostrarAlerta"
        header="Senha atualizada"
        message="Sua senha foi alterada com sucesso. Faça login com a nova senha."
        :buttons="botoesAlerta"
        @didDismiss="mostrarAlerta = false"
      />
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
  IonAlert,
} from "@ionic/vue";

import {
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  shieldCheckmarkOutline,
  alertCircleOutline,
} from "ionicons/icons";

import { definirNovaSenha } from "@/services/supabaseService";

const router = useRouter();

const senha = ref("");
const confirmarSenha = ref("");
const mostrarSenha = ref(false);
const carregando = ref(false);
const erro = ref("");
const mostrarAlerta = ref(false);

const botoesAlerta = [
  {
    text: "Ir para o login",
    handler: () => {
      router.replace("/login");
    },
  },
];

async function salvarSenha() {
  erro.value = "";

  if (!senha.value || !confirmarSenha.value) {
    erro.value = "Preencha os dois campos de senha.";
    return;
  }

  if (senha.value.length < 6) {
    erro.value = "A senha precisa ter pelo menos 6 caracteres.";
    return;
  }

  if (senha.value !== confirmarSenha.value) {
    erro.value = "As senhas não coincidem.";
    return;
  }

  carregando.value = true;

  try {
    await definirNovaSenha(senha.value);
    mostrarAlerta.value = true;
  } catch (error: unknown) {
    erro.value =
      error instanceof Error
        ? error.message
        : "Não foi possível atualizar a senha. Abra novamente o link de recuperação.";
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
  line-height: 1.5;
}

.app-field {
  margin: 12px 0;
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
  margin-top: 10px;
  text-transform: none;
}

.message-item {
  --background: transparent;
  font-size: 14px;
}
</style>
