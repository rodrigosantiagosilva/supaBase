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
              <ion-icon :icon="lockClosedOutline" />
              <ion-title>Nova senha</ion-title>
              <ion-text>Escolha uma nova senha para sua conta.</ion-text>
            </ion-card>

            <ion-card class="app-card" style="margin: 0">
              <ion-text class="app-heading">Redefinir senha</ion-text>

              <ion-item class="app-field" lines="none">
                <ion-input
                  v-model="senha"
                  type="password"
                  label="Nova senha"
                  label-placement="stacked"
                  placeholder="Mínimo de 6 caracteres"
                  autocomplete="new-password"
                />
              </ion-item>

              <ion-item class="app-field" lines="none">
                <ion-input
                  v-model="confirmacao"
                  type="password"
                  label="Confirmar nova senha"
                  label-placement="stacked"
                  placeholder="Digite novamente"
                  autocomplete="new-password"
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
                @click="salvar"
              >
                {{ carregando ? "Salvando..." : "Salvar nova senha" }}
              </ion-button>

              <ion-text class="app-link" @click="router.replace('/login')">
                Voltar para o login
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
import { lockClosedOutline } from "ionicons/icons";
import { definirNovaSenha } from "@/services/supabaseService";

const router = useRouter();
const senha = ref("");
const confirmacao = ref("");
const mensagem = ref("");
const sucesso = ref(false);
const carregando = ref(false);

async function salvar() {
  mensagem.value = "";
  sucesso.value = false;

  if (senha.value.length < 6) {
    mensagem.value = "A senha deve ter pelo menos 6 caracteres.";
    return;
  }

  if (senha.value !== confirmacao.value) {
    mensagem.value = "As senhas não coincidem.";
    return;
  }

  carregando.value = true;

  try {
    await definirNovaSenha(senha.value);
    sucesso.value = true;
    mensagem.value = "Senha alterada com sucesso!";
    await router.replace("/login");
  } catch (error) {
    mensagem.value =
      error instanceof Error
        ? error.message
        : "Não foi possível alterar a senha.";
  } finally {
    carregando.value = false;
  }
}
</script>
