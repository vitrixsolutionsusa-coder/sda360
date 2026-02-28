"use client"

import { useTransition, useState } from "react"
import { toast } from "sonner"
import { MessageSquarePlus, Loader2, Clock } from "lucide-react"
import { addFollowUpNote } from "@/actions/visitors"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Note = {
  date: string
  note: string
  author_id: string
  author_name?: string
}

type FollowUpNotesProps = {
  visitorId: string
  notes: Note[]
}

export function FollowUpNotes({ visitorId, notes }: FollowUpNotesProps) {
  const [isPending, startTransition] = useTransition()
  const [noteText, setNoteText] = useState("")

  const handleAddNote = () => {
    if (!noteText.trim()) return
    startTransition(async () => {
      const result = await addFollowUpNote(visitorId, { note: noteText.trim() })
      if (!result.success) { toast.error(result.error); return }
      toast.success("Nota adicionada!")
      setNoteText("")
    })
  }

  return (
    <div className="space-y-4">
      {/* Adicionar nota */}
      <div className="space-y-2">
        <Textarea
          placeholder="Adicionar nota de acompanhamento..."
          rows={3}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          disabled={isPending}
        />
        <Button
          onClick={handleAddNote}
          disabled={isPending || !noteText.trim()}
          size="sm"
          className="gap-1.5"
        >
          {isPending
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <MessageSquarePlus className="h-4 w-4" />
          }
          Adicionar nota
        </Button>
      </div>

      {/* Lista de notas */}
      {notes.length === 0 ? (
        <div className="flex flex-col items-center py-6 text-center text-muted-foreground">
          <MessageSquarePlus className="h-8 w-8 mb-2 opacity-40" />
          <p className="text-sm">Nenhuma nota de acompanhamento ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...notes].reverse().map((note, i) => (
            <div key={i} className="flex gap-3 rounded-lg border p-3">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="text-xs">
                  {note.author_name
                    ? note.author_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
                    : "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium">
                    {note.author_name ?? "Responsável"}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(note.date).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap">{note.note}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
