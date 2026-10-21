
<template>
  <ion-page>
    <ion-content class="app-content" :fullscreen="true">
      <ion-grid class="app-shell">
        <ion-row>
          <ion-col>
            <div class="login-brand">
              <div class="brand-icon">
                <ion-icon :icon="shieldCheckmarkOutline" />
              </div>

              <h1>Bem-vindo!</h1>
              <p>Entre na sua conta para continuar.</p>
            </div>

            <ion-card class="app-card login-card">
              <div class="login-heading">
                <h2>Entrar</h2>
                <p>Informe seus dados de acesso.</p>
              </div>

              <form @submit.prevent="entrar">
                <ion-item class="app-field" lines="none">
                  <ion-icon :icon="mailOutline" slot="start" />

                  <ion-input
                    v-model="email"
                    type="email"
                    label="E-mail"
                    label-placement="stacked"
                    placeholder="seu@email.com"
                    autocomplete="email"
                    required
                  />
                </ion-item>

                <ion-item class="app-field" lines="none">
                  <ion-icon :icon="lockClosedOutline" slot="start" />

                  <ion-input
                    v-model="senha"
                    :type="mostrarSenha ? 'text' : 'password'"
                    label="Senha"
                    label-placement="stacked"
                    placeholder="Digite sua senha"
                    autocomplete="current-password"
                    required
                  />

                  <ion-button
                    fill="clear"
                    slot="end"
                    type="button"
                    @click="mostrarSenha = !mostrarSenha"
                    :aria-label="mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'"
                  >
                    <ion-icon
                      :icon="mostrarSenha ? eyeOffOutline : eyeOutline"
                    />
                  </ion-button>
                </ion-item>

                <div class="forgot-password">
                  <a @click="irPara('/recuperar-senha')">
                    Esqueci minha senha
                  </a>
                </div>

                <ion-text v-if="erro" class="app-error">
                  {{ erro }}
                </ion-text>

                <ion-button
                  class="app-button"
                  expand="block"
                  type="submit"
                  :disabled="carregando"
                >
                  <ion-spinner
                    v-if="carregando"
                    name="crescent"
                    slot="start"
                  />
                  {{ carregando ? 'Entrando...' : 'Entrar na conta' }}
                </ion-button>
              </form>

              <div class="register-link">
                <span>Não tem uma conta?</span>
                <a @click="irPara('/cadastro')">Cadastre-se</a>
              </div>
            </ion-card>

            <div class="login-footer">
              <ion-icon :icon="shieldCheckmarkOutline" />
              <span>Seus dados são protegidos.</span>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>

    <ion-alert
      :is-open="alertaAberto"
      header="Atenção"
      :message="mensagemAlerta"
      :buttons="['OK']"
      @did-dismiss="alertaAberto = false"
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
  IonItem,
  IonInput,
  IonIcon,
  IonButton,
  IonText,
  IonSpinner,
  IonAlert,
} from "@ionic/vue";

import {
  shieldCheckmarkOutline,
  mailOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
} from "ionicons/icons";

import { loginUsuario } from "@/services/supabaseService";

const router = useRouter();

const email = ref("");
const senha = ref("");
const mostrarSenha = ref(false);
const carregando = ref(false);
const erro = ref("");

const alertaAberto = ref(false);
const mensagemAlerta = ref("");

function irPara(caminho: string) {
  router.push(caminho);
}

async function entrar() {
  erro.value = "";

  if (!email.value.trim() || !senha.value) {
    erro.value = "Preencha seu e-mail e sua senha.";
    return;
  }

  carregando.value = true;

  try {
    await loginUsuario(email.value, senha.value);

    const destino = router.currentRoute.value.query.redirect;

    const caminhoDestino =
      typeof destino === "string" &&
      destino.startsWith("/") &&
      !destino.startsWith("//") &&
      !destino.startsWith("/login")
        ? destino
        : "/tabs/inicio";

    await router.replace(caminhoDestino);
  } catch (error: unknown) {
    const mensagem =
      error instanceof Error ? error.message : "";

    if (
      mensagem.toLowerCase().includes("invalid login credentials")
    ) {
      erro.value = "E-mail ou senha incorretos.";
    } else if (
      mensagem.toLowerCase().includes("email not confirmed")
    ) {
      erro.value = "Confirme seu e-mail antes de entrar.";
    } else {
      erro.value = mensagem || "Não foi possível entrar. Tente novamente.";
    }
  } finally {
    carregando.value = false;
  }
}
</script>

<style scoped>
.login-brand {
  text-align: center;
  margin: 28px 0 30px;
}

.brand-icon {
  width: 76px;
  height: 76px;
  margin: 0 auto 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eaf1fa;
  border: 1px solid #dce5f1;
  border-radius: 24px;
}

.brand-icon ion-icon {
  color: #101d36;
  font-size: 42px;
}

.login-brand h1 {
  color: #101d36;
  font-size: 29px;
  font-weight: 800;
  margin: 0 0 10px;
}

.login-brand p,
.login-heading p {
  color: #718096;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

.login-card {
  margin: 0;
}

.login-heading h2 {
  color: #101d36;
  font-size: 23px;
  font-weight: 800;
  margin: 0 0 7px;
}

.login-heading {
  margin-bottom: 22px;
}

.forgot-password {
  text-align: right;
  margin: 15px 3px 8px;
}

.forgot-password a,
.register-link a {
  color: #315b96;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.register-link {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 24px;
  font-size: 14px;
  color: #718096;
}

.login-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #718096;
  font-size: 12px;
  margin-top: 24px;
}

.login-footer ion-icon {
  color: #315b96;
  font-size: 17px;
}

.app-error {
  display: block;
  margin-top: 12px;
}

@media (max-width: 360px) {
  .login-brand h1 {
    font-size: 25px;
  }

  .login-card {
    padding: 18px 14px;
  }
}
</style>
