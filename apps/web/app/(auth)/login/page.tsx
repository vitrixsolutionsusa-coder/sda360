"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { signIn } from "@/actions/auth"
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

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    startTransition(async () => {
      const result = await signIn(data.email, data.password)
      if (result && !result.success) {
        toast.error(result.error)
      }
    })
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl">Entrar na sua conta</CardTitle>
        <CardDescription>
          Digite seu e-mail e senha para acessar o sistema.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Link
                href="/esqueci-senha"
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
              >
                Esqueci minha senha
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isPending}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Entrar
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link
            href="/register"
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
          >
            Solicitar acesso
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
