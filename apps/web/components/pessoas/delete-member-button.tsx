"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { deleteMember } from "@/actions/members"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function DeleteMemberButton({ memberId, memberName }: { memberId: string; memberName: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteMember(memberId)
      if (!result.success) { toast.error(result.error); return }
      toast.success("Membro removido.")
      router.push("/dashboard/pessoas/membros")
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4 mr-1" /> Remover
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover membro</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja remover <strong>{memberName}</strong>? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>Cancelar</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Remover
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
