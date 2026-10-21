<template>
  <ion-page>
    <ion-content class="app-content" :fullscreen="true">
      <ion-grid class="app-shell">
        <ion-row>
          <ion-col>
            <ion-card
              class="app-brand"
              style="box-shadow: none; background: transparent"
            >
              <ion-icon :icon="mailUnreadOutline" />
              <ion-title>Recuperar senha</ion-title>
              <ion-text>Vamos ajudar você a recuperar o acesso.</ion-text>
            </ion-card>

            <ion-card class="app-card" style="margin: 0">
              <ion-text class="app-heading">Esqueceu a senha?</ion-text>
              <ion-text class="app-description">
                Informe seu e-mail. Enviaremos um link para criar uma nova
                senha.
              </ion-text>

              <ion-item class="app-field" lines="none">
                <ion-icon :icon="mailOutline" slot="start" />
                <ion-input
                  v-model="email"
                  type="email"
                  label="E-mail cadastrado"
                  label-placement="stacked"
                  placeholder="seu@email.com"
                  autocomplete="email"
                />
              </ion-item>

              <ion-text
                v-if="mensagem"
                :class="sucesso ? 'app-success' : 'app-error'"
              >
                {{ mensagem }}
              </ion-text>

              <ion-button
                class="app-button"
                expand="block"
                :disabled="carregando"
                @click="enviar"
              >
                {{ carregando ? "Enviando..." : "Enviar link de recuperação" }}
              </ion-button>

              <ion-text class="app-link" @click="router.push('/login')">
                <strong>Voltar para o login</strong>
              </ion-text>
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
  IonTitle,
  IonText,
  IonIcon,
  IonItem,
  IonInput,
  IonButton,
} from "@ionic/vue";
import { mailUnreadOutline, mailOutline } from "ionicons/icons";
import { recuperarSenha } from "@/services/supabaseService";

const router = useRouter();
const email = ref("");
const mensagem = ref("");
const sucesso = ref(false);
const carregando = ref(false);

async function enviar() {
  mensagem.value = "";
  sucesso.value = false;

  if (!email.value.trim()) {
    mensagem.value = "Informe seu e-mail.";
    return;
  }

  carregando.value = true;

  try {
    await recuperarSenha(email.value);
    mensagem.value =
      "Se o endereço estiver cadastrado, você receberá as instruções por e-mail.";
    sucesso.value = true;
  } catch (error) {
    mensagem.value =
      error instanceof Error
        ? error.message
        : "Não foi possível enviar o e-mail.";
  } finally {
    carregando.value = false;
  }
}
</script>
