import { z } from "zod";
import { BAD_WORDS } from "../utils/badWords";

const temSequenciaNumerica = (val: string) => {
  for (let i = 0; i <= val.length - 6; i++) {
    const sub = val.substring(i, i + 6);
    if ("0123456789".includes(sub) || "9876543210".includes(sub)) {
      return true;
    }
  }
  return false;
};

const naoContemPalavraoNoEmail = (email: string) => {
  if (!email || !email.includes("@")) return true;

  const parteLocal = email.split("@")[0].toLowerCase();

  const partesDoNomeEmail = parteLocal.split(/[._\-+]/);

  const contemPalavrao = BAD_WORDS.some(
    (palavra) =>
      parteLocal.includes(palavra) || partesDoNomeEmail.includes(palavra),
  );

  return !contemPalavrao;
};

const nomeCompletoValidator = z
  .string()
  .min(5, "O nome deve ter no mínimo 5 caracteres.")
  .regex(
    /^[a-zA-ZÀ-ÖØ-öø-ÿ\s']+$/,
    "O nome deve conter apenas letras e espaços.",
  )
  .refine(
    (val) => val.trim().split(/\s+/).length >= 2,
    "Digite seu nome e sobrenome.",
  )
  .refine(
    (val) =>
      val
        .trim()
        .split(/\s+/)
        .some((w) => w.length >= 3),
    "Insira um nome válido (pelo menos uma palavra com 3 letras).",
  )
  .refine(
    (val) =>
      !val
        .trim()
        .split(/\s+/)
        .some((w) => w.length > 1 && /^([a-zA-ZÀ-ÖØ-öø-ÿ])\1+$/i.test(w)),
    "Nome inválido (palavra inteira com a mesma letra repetida, ex: 'aaa').",
  )
  .refine(
    (val) => !/([a-zA-ZÀ-ÖØ-öø-ÿ])\1{2,}/i.test(val),
    "Nome inválido (limite de 2 letras idênticas seguidas).",
  )
  .refine((val) => {
    const palavrasDigitadas = val.toLowerCase().split(/\s+/);
    const contemPalavrao = palavrasDigitadas.some((palavra) =>
      BAD_WORDS.includes(palavra),
    );
    return !contemPalavrao;
  }, "Por favor, utilize um linguajar apropriado para o ambiente acadêmico.");

export const profileSchema = z.object({
  nome: nomeCompletoValidator,
  email: z
    .string()
    .min(1, "O e-mail é obrigatório.")
    .email("Digite um e-mail válido (ex: aluno@fatec.sp.gov.br).")
    .refine(naoContemPalavraoNoEmail, "O e-mail contém termos inadequados."),
});
export type ProfileFormData = z.infer<typeof profileSchema>;

export const userSchema = z.object({
  nome: nomeCompletoValidator,
  email: z
    .string()
    .min(1, "O e-mail é obrigatório.")
    .email("Digite um e-mail válido.")
    .refine(naoContemPalavraoNoEmail, "O e-mail contém termos inadequados."),
  senha: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres.")
    .optional()
    .or(z.literal("")),
  role: z.enum(["ADMIN", "COORDENADOR", "AUXILIAR"]),
});
export type UserFormData = z.infer<typeof userSchema>;

export const simpleNameSchema = z.object({
  name: z.string().min(3, "O nome precisa ter pelo menos 3 caracteres."),
});
export type SimpleNameFormData = z.infer<typeof simpleNameSchema>;

export const alunoAuthSchema = z.object({
  nomeUsuario: nomeCompletoValidator,

  raAluno: z
    .string()
    .min(1, "Preencha seu RA.")
    .regex(/^\d{13}$/, "O RA deve conter exatamente 13 números.")
    .refine(
      (val) => !/(\d)\1{5}/.test(val),
      "RA inválido (números idênticos repetidos).",
    )
    .refine(
      (val) => !temSequenciaNumerica(val),
      "RA inválido (não são permitidos números em sequência).",
    ),

  emailUsuario: z
    .string()
    .min(1, "Preencha seu e-mail.")
    .email("Digite um formato de e-mail válido.")
    .refine(naoContemPalavraoNoEmail, "O e-mail contém termos inadequados.")
    .refine((val) => {
      const emailLower = val.toLowerCase();
      return (
        emailLower.endsWith("@fatec.sp.gov.br") ||
        emailLower.endsWith("@aluno.cps.sp.gov.br")
      );
    }, "Utilize seu e-mail institucional (@fatec.sp.gov.br ou @aluno.cps.sp.gov.br)."),
});
export type AlunoAuthFormData = z.infer<typeof alunoAuthSchema>;

export const visitanteAuthSchema = z.object({
  nomeUsuario: nomeCompletoValidator,
  emailUsuario: z
    .string()
    .min(1, "Preencha seu e-mail.")
    .email("Digite um e-mail válido.")
    .refine(naoContemPalavraoNoEmail, "O e-mail contém termos inadequados."),
});
export type VisitanteAuthFormData = z.infer<typeof visitanteAuthSchema>;

export const loginAdminSchema = z.object({
  email: z
    .string()
    .min(1, "Preencha o e-mail institucional.")
    .email("Digite um formato de e-mail válido."),
  password: z.string().min(1, "A senha é obrigatória."),
});
export type LoginAdminFormData = z.infer<typeof loginAdminSchema>;

export const recoverySchema = z.object({
  email: z
    .string()
    .min(1, "Preencha o e-mail.")
    .email("Digite um e-mail válido para recuperação.")
    .refine(naoContemPalavraoNoEmail, "O e-mail contém termos inadequados."),
});
export type RecoveryFormData = z.infer<typeof recoverySchema>;

export const registerSchema = z
  .object({
    tipoUsuario: z.enum(["ALUNO", "EXTERNO"]),
    nome: nomeCompletoValidator,
    email: z
      .string()
      .min(1, "O e-mail é obrigatório.")
      .email("Digite um e-mail válido.")
      .refine(naoContemPalavraoNoEmail, "O e-mail contém termos inadequados."),
    documento: z.string().min(5, "O documento é obrigatório (apenas números)."),
  })
  .superRefine((data, ctx) => {
    if (
      data.tipoUsuario === "ALUNO" &&
      !data.email.toLowerCase().includes("@fatec.sp.gov.br")
    ) {
      ctx.addIssue({
        path: ["email"],
        code: z.ZodIssueCode.custom,
        message: "Alunos devem utilizar o e-mail @fatec.sp.gov.br",
      });
    }
  });
export type RegisterFormData = z.infer<typeof registerSchema>;

export const createEventSchema = z.object({
  nome: z.string().min(3, "O nome do evento é obrigatório."),
  localId: z.number().min(1, "Selecione a sala/localização."),
  data: z.string().min(1, "A data do evento é obrigatória."),
  horaInicio: z.string().min(1, "Obrigatório."),
  horaFim: z.string().min(1, "Obrigatório."),
  categoriaId: z.number().optional().nullable(),
  cursoId: z.number().optional().nullable(),
  semestre: z.string().optional(),
  limiteInscricoes: z.string().optional(),
  palestrante: z.string().optional(),
  eventoRestrito: z.boolean(),
  descricao: z.string().optional(),
});
export type CreateEventFormData = z.infer<typeof createEventSchema>;
