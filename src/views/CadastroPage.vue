
<template>
  <ion-page>
    <ion-content :fullscreen="true" class="app-content">
      <ion-grid class="page-grid">
        <ion-row class="ion-justify-content-center ion-align-items-center">
          <ion-col size="12" size-sm="10" size-md="7" size-lg="5">
            <ion-card class="app-card">
              <ion-card-header class="ion-text-center">
                <ion-button
                  fill="clear"
                  class="back-button"
                  @click="router.replace('/login')"
                >
                  <ion-icon :icon="arrowBackOutline" slot="start" />
                  Voltar ao login
                </ion-button>

                <ion-icon :icon="personAddOutline" class="brand-icon" />

                <ion-card-title class="app-heading">
                  Criar conta
                </ion-card-title>

                <ion-card-subtitle class="app-description">
                  Preencha os dados para começar.
                </ion-card-subtitle>
              </ion-card-header>

              <ion-card-content>
                <ion-list lines="none">
                  <ion-item class="app-field">
                    <ion-icon :icon="personOutline" slot="start" />
                    <ion-input
                      v-model="nome"
                      label="Nome"
                      label-placement="stacked"
                      placeholder="Seu nome completo"
                      autocomplete="name"
                      required
                    />
                  </ion-item>
                  <ion-item class="app-field">
                    <ion-icon :icon="mailOutline" slot="start" />
                    <ion-input
                      v-model="email"
                      label="E-mail"
                      label-placement="stacked"
                      type="email"
                      placeholder="seuemail@exemplo.com"
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
                      placeholder="Mínimo de 6 caracteres"
                      autocomplete="new-password"
                      required
                    />
                    <ion-button
                      slot="end"
                      fill="clear"
                      color="medium"
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
                      label="Confirmar senha"
                      label-placement="stacked"
                      :type="mostrarSenha ? 'text' : 'password'"
                      placeholder="Digite a senha novamente"
                      autocomplete="new-password"
                      required
                    />
                  </ion-item>
                </ion-list>

                <ion-button
                  expand="block"
                  class="app-button"
                  :disabled="carregando"
                  @click="cadastrar"
                >
                  <ion-spinner v-if="carregando" name="crescent" />
                  <ion-text v-else>Cadastrar</ion-text>
                </ion-button>

                <ion-button
                  expand="block"
                  fill="clear"
                  class="login-button"
                  :disabled="carregando"
                  @click="router.replace('/login')"
                >
                  Já tenho uma conta
                </ion-button>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
    <ion-alert
      :is-open="alertaAberto"
      :header="tituloAlerta"
      :message="mensagemAlerta"
      :buttons="['OK']"
      @didDismiss="alertaAberto = false"
    />
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
  IonButton,
  IonIcon,
  IonItem,
  IonList,
  IonInput,
  IonText,
  IonSpinner,
  IonAlert,
} from "@ionic/vue";

import {
  arrowBackOutline,
  personAddOutline,
  personOutline,
  mailOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  shieldCheckmarkOutline,
} from "ionicons/icons";

import { cadastrarUsuario } from "@/services/supabaseService";

const router = useRouter();

const nome = ref("");
const email = ref("");
const senha = ref("");
const confirmarSenha = ref("");

const mostrarSenha = ref(false);
const carregando = ref(false);

const alertaAberto = ref(false);
const tituloAlerta = ref("Erro no cadastro");
const mensagemAlerta = ref("");
function mostrarAlerta(titulo: string, mensagem: string) {
  tituloAlerta.value = titulo;
  mensagemAlerta.value = mensagem;
  alertaAberto.value = true;
}

async function cadastrar() {
  if (carregando.value) return;

  if (
    !nome.value.trim() ||
    !email.value.trim() ||
    !senha.value ||
    !confirmarSenha.value
  ) {
    mostrarAlerta(
      "Campos obrigatórios",
      "Preencha todos os campos para continuar.",
    );
    return;
  }

  if (senha.value.length < 6) {
    mostrarAlerta(
      "Senha inválida",
      "A senha precisa ter pelo menos 6 caracteres.",
    );
    return;
  }

  if (senha.value !== confirmarSenha.value) {
    mostrarAlerta(
      "Senhas diferentes",
      "As senhas digitadas não coincidem.",
    );
    return;
  }

  carregando.value = true;

  try {
    const { user, session } = await cadastrarUsuario(
      nome.value.trim(),
      email.value.trim(),
      senha.value,
    );

    if (!user) {
      throw new Error(
        "O Supabase não retornou os dados do usuário cadastrado.",
      );
    }

    if (session) {
      await router.replace("/tabs/inicio");
      return;
    }

    mostrarAlerta(
      "Confirme seu e-mail",
      "Cadastro realizado! Verifique sua caixa de entrada para confirmar sua conta.",
    );
  } catch (error: unknown) {
    console.error("Erro ao cadastrar no Supabase:", error);

    mostrarAlerta(
      "Erro ao criar conta",
      error instanceof Error
        ? error.message
        : "Não foi possível cadastrar sua conta. Tente novamente.",
    );
  } finally {
    carregando.value = false;
  }
}
</script>
