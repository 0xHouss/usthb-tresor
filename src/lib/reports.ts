import { ReportReason, ReportStatus } from "@prisma/client";

export const reportReasonLabels: { [key in ReportReason]: string } = {
  [ReportReason.CorruptedFile]: "Fichier corrompu",
  [ReportReason.WrongMetadata]: "Informations erronées",
  [ReportReason.Copyright]: "Droits d'auteur",
  [ReportReason.Other]: "Autre",
};

export const reportStatusLabels: { [key in ReportStatus]: string } = {
  [ReportStatus.Open]: "Ouvert",
  [ReportStatus.Resolved]: "Résolu",
  [ReportStatus.Dismissed]: "Rejeté",
};
