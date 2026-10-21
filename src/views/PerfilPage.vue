<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="app-toolbar">
        <ion-title>Meu perfil</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="app-content">
      <ion-grid class="app-shell">
        <ion-row>
          <ion-col>
            <ion-card class="app-card" style="margin:0">
              <div class="app-avatar">
                <img v-if="fotoUrl" :src="fotoUrl" alt="Foto do perfil" />
                <ion-icon v-else :icon="personCircleOutline" />
              </div>

              <ion-text class="app-link" @click="selecionarFoto">
                Alterar foto de perfil
              </ion-text>

              <input
                ref="arquivoInput"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                @change="alterarFoto"
              />

              <ion-text class="app-heading">Seus dados</ion-text>
              <ion-text class="app-description">
                Mantenha suas informações atualizadas.
              </ion-text>

              <ion-item class="app-field" lines="none">
                <ion-icon :icon="personOutline" slot="start" />
                <ion-input
                  v-model="nome"
                  label="Nome completo"
                  label-placement="stacked"
                  placeholder="Seu nome"
                />
              </ion-item>

              <ion-item class="app-field" lines="none">
                <ion-icon :icon="atOutline" slot="start" />
                <ion-input
                  v-model="nickname"
                  label="Nickname"
                  label-placement="stacked"
                  placeholder="Seu apelido"
                />
              </ion-item>

              <ion-text v-if="mensagem" :class="sucesso ? 'app-success' : 'app-error'">
                {{ mensagem }}
              </ion-text>

              <ion-button
                class="app-button"
                expand="block"
                :disabled="carregando"
                @click="salvar"
              >
                {{ carregando ? 'Salvando...' : 'Salvar alterações' }}
              </ion-button>

              <ion-button
                expand="block"
                fill="outline"
                color="danger"
                style="margin-top:16px;--border-radius:12px;height:46px"
                :disabled="carregando"
                @click="confirmarSaida"
              >
                <ion-icon :icon="logOutOutline" slot="start" />
                Sair da conta
              </ion-button>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-alert
        :is-open="alertaSaida"
        header="Sair da conta"
        message="Deseja realmente encerrar sua sessão?"
        :buttons="botoesSaida"
        @did-dismiss="alertaSaida = false"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonGrid, IonRow, IonCol, IonCard, IonText, IonIcon,
  IonItem, IonInput, IonButton, IonAlert,
} from "@ionic/vue";
import {
  personCircleOutline, personOutline, atOutline, logOutOutline,
} from "ionicons/icons";
import {
  buscarPerfil,
  atualizarPerfil,
  enviarFotoPerfil,
  obterUrlFoto,
  sairDaConta,
} from "@/services/supabaseService";

const router = useRouter();

const nome = ref("");
const nickname = ref("");
const fotoUrl = ref("");
const caminhoFoto = ref("");
const mensagem = ref("");
const sucesso = ref(false);
const carregando = ref(false);
const alertaSaida = ref(false);
const arquivoInput = ref<HTMLInputElement | null>(null);

onMounted(carregarPerfil);

async function carregarPerfil() {
  try {
    const perfil = await buscarPerfil();

    nome.value = perfil.nome;
    nickname.value = perfil.nickname ?? "";
    caminhoFoto.value = perfil.avatar_path ?? "";

    if (caminhoFoto.value) {
      fotoUrl.value = await obterUrlFoto(caminhoFoto.value);
    }
  } catch (error) {
    mensagem.value =
      error instanceof Error ? error.message : "Não foi possível carregar o perfil.";
  }
}

async function salvar() {
  mensagem.value = "";
  sucesso.value = false;

  if (!nome.value.trim()) {
    mensagem.value = "Informe seu nome.";
    return;
  }

  carregando.value = true;

  try {
    await atualizarPerfil(nome.value, nickname.value);
    mensagem.value = "Perfil atualizado com sucesso!";
    sucesso.value = true;
  } catch (error) {
    mensagem.value =
      error instanceof Error ? error.message : "Não foi possível atualizar o perfil.";
  } finally {
    carregando.value = false;
  }
}

function selecionarFoto() {
  arquivoInput.value?.click();
}

async function alterarFoto(event: Event) {
  const input = event.target as HTMLInputElement;
  const arquivo = input.files?.[0];

  if (!arquivo) return;

  mensagem.value = "";
  sucesso.value = false;
  carregando.value = true;

  try {
    caminhoFoto.value = await enviarFotoPerfil(arquivo);
    fotoUrl.value = await obterUrlFoto(caminhoFoto.value);
    mensagem.value = "Foto de perfil atualizada!";
    sucesso.value = true;
  } catch (error) {
    mensagem.value =
      error instanceof Error ? error.message : "Não foi possível enviar a foto.";
  } finally {
    carregando.value = false;
    input.value = "";
  }
}

function confirmarSaida() {
  alertaSaida.value = true;
}

const botoesSaida = [
  {
    text: "Cancelar",
    role: "cancel",
  },
  {
    text: "Sair",
    role: "destructive",
    handler: async () => {
      try {
        await sairDaConta();
        await router.replace("/login");
      } catch (error) {
        mensagem.value =
          error instanceof Error ? error.message : "Não foi possível sair da conta.";
      }
    },
  },
];
</script>