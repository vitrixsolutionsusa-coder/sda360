"use client"

import { useTransition } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"
import { signUp } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const registerSchema = z
  .object({
    fullName: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [isPending, startTransition] = useTransition()
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = (data: RegisterFormData) => {
    startTransition(async () => {
      const result = await signUp(data.email, data.password, data.fullName)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      setIsSuccess(true)
    })
  }

  if (isSuccess) {
    return (
      <Card className="border-0 shadow-none">
        <CardContent className="px-0 flex flex-col items-center text-center py-8 space-y-4">
          <CheckCircle2 className="h-16 w-16 text-emerald-500" />
          <CardTitle className="text-xl">Cadastro realizado!</CardTitle>
          <CardDescription className="max-w-sm">
            Verifique seu e-mail para confirmar sua conta. Após a confirmação,
            o administrador da sua igreja irá ativar seu acesso.
          </CardDescription>
          <Link href="/login">
            <Button variant="outline">Voltar para o login</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl">Solicitar acesso</CardTitle>
        <CardDescription>
          Crie sua conta e aguarde a aprovação do administrador da sua igreja.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome completo</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="João Silva"
              autoComplete="name"
              disabled={isPending}
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-xs text-destructive">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              disabled={isPending}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isPending}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isPending}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Criar conta
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
          >
            Entrar
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
