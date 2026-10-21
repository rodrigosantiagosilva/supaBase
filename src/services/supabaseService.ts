import { supabase } from "@/lib/supabaseClient";

export interface Perfil {
  id: string;
  nome: string;
  nickname: string | null;
  avatar_path: string | null;
  created_at?: string;
}

export async function cadastrarUsuario(
  nome: string,
  email: string,
  senha: string,
) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password: senha,
    options: {
      data: {
        nome: nome.trim(),
      },
      emailRedirectTo: `${window.location.origin}/login`,
    },
  });

  if (error) throw error;

  return data;
}

export async function loginUsuario(email: string, senha: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: senha,
  });

  if (error) throw error;

  return data;
}

export async function recuperarSenha(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${window.location.origin}/nova-senha`,
  });

  if (error) throw error;
}

export async function definirNovaSenha(senha: string) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) {
    throw new Error("Sessão de recuperação inválida. Solicite outro link.");
  }

  const { error } = await supabase.auth.updateUser({
    password: senha,
  });

  if (error) throw error;
}

export async function buscarPerfil(): Promise<Perfil> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("Você não está autenticado.");

  const { data, error } = await supabase
    .from("profiles")
    .select("id, nome, nickname, avatar_path, created_at")
    .eq("id", user.id)
    .single();

  if (error) throw error;

  return data as Perfil;
}
export async function atualizarPerfil(
  nome: string,
  nickname: string,
) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("Você não está autenticado.");

  const { error } = await supabase
    .from("profiles")
    .update({
      nome: nome.trim(),
      nickname: nickname.trim() || null,
    })
    .eq("id", user.id);

  if (error) throw error;
}


export async function enviarFotoPerfil(arquivo: File) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("Você não está autenticado.");

  const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];

  if (!tiposPermitidos.includes(arquivo.type)) {
    throw new Error("Escolha uma imagem JPG, PNG ou WEBP.");
  }

  if (arquivo.size > 5 * 1024 * 1024) {
    throw new Error("A imagem deve ter no máximo 5 MB.");
  }

  const extensaoPorTipo: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };

  const caminho = `${user.id}/avatar.${extensaoPorTipo[arquivo.type]}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(caminho, arquivo, {
      upsert: true,
      contentType: arquivo.type,
    });

  if (uploadError) throw uploadError;

  const { error: perfilError } = await supabase
    .from("profiles")
    .update({ avatar_path: caminho })
    .eq("id", user.id);

  if (perfilError) throw perfilError;

  return caminho;
}


export async function obterUrlFoto(caminho: string) {
  const { data, error } = await supabase.storage
    .from("avatars")
    .createSignedUrl(caminho, 3600);

  if (error) throw error;

  return data.signedUrl;
}


export async function sairDaConta() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}
