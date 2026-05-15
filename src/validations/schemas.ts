import { z } from "zod";

export const profileSchema = z.object({
  nome: z.string().min(3, "O nome deve ter no mínimo 3 caracteres."),
  email: z
    .string()
    .email("Digite um e-mail válido (ex: aluno@fatec.sp.gov.br)."),
});
export type ProfileFormData = z.infer<typeof profileSchema>;
export const userSchema = z.object({
  nome: z.string().min(3, "O nome deve ter no mínimo 3 caracteres."),
  email: z.string().email("Digite um e-mail válido."),
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
  nomeUsuario: z.string().min(3, "O nome deve ter no mínimo 3 letras."),
  raAluno: z.string().min(5, "Digite um RA válido."),
  emailUsuario: z.string().email("Digite um e-mail válido."),
});
export type AlunoAuthFormData = z.infer<typeof alunoAuthSchema>;

export const visitanteAuthSchema = z.object({
  nomeUsuario: z.string().min(3, "O nome deve ter no mínimo 3 letras."),
  emailUsuario: z.string().email("Digite um e-mail válido."),
});
export type VisitanteAuthFormData = z.infer<typeof visitanteAuthSchema>;

export const loginAdminSchema = z.object({
  email: z.string().email("Digite um e-mail válido."),
  password: z.string().min(1, "A senha é obrigatória."),
});
export type LoginAdminFormData = z.infer<typeof loginAdminSchema>;

export const recoverySchema = z.object({
  email: z.string().email("Digite um e-mail válido para recuperação."),
});
export type RecoveryFormData = z.infer<typeof recoverySchema>;

export const registerSchema = z
  .object({
    tipoUsuario: z.enum(["ALUNO", "EXTERNO"]),
    nome: z.string().min(3, "O nome deve ter no mínimo 3 letras."),
    email: z.string().email("Digite um e-mail válido."),
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
