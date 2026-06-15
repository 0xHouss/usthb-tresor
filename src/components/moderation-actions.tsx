"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { approveResource, rejectResource } from "@/app/(app)/moderate/actions";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function ModerationActions({ id }: { id: string }) {
    const [pending, startTransition] = useTransition();
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState("");

    function approve() {
        startTransition(async () => {
            try {
                await approveResource(id);
                toast.success("Ressource approuvée");
            } catch {
                toast.error("Une erreur est survenue");
            }
        });
    }

    function reject() {
        startTransition(async () => {
            try {
                await rejectResource(id, reason);
                toast.success("Ressource rejetée");
                setOpen(false);
                setReason("");
            } catch {
                toast.error("Une erreur est survenue");
            }
        });
    }

    return (
        <div className="flex justify-end gap-2">
            <Button size="sm" onClick={approve} disabled={pending}>
                Approuver
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button size="sm" variant="destructive" disabled={pending}>
                        Rejeter
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rejeter la ressource</DialogTitle>
                    </DialogHeader>
                    <Textarea
                        placeholder="Motif du rejet (optionnel)"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                    <DialogFooter>
                        <Button variant="destructive" onClick={reject} disabled={pending}>
                            Confirmer le rejet
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
