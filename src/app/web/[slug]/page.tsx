import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LABS, getLabBySlug, getNextLab, isPlayable } from "@/content/curriculum";
import { LabExperience } from "@/components/lab/LabExperience";
import { LockGate } from "@/components/lab/LockGate";
import { Tutorial } from "@/components/tutorial/Tutorial";

export function generateStaticParams() {
  return LABS.map((lab) => ({ slug: lab.slug }));
}

export async function generateMetadata({ params }: PageProps<"/web/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const lab = getLabBySlug(slug);
  if (!lab) return { title: "Nivel no encontrado" };
  const prefix = lab.kind === "checkpoint" ? "Checkpoint" : lab.kind === "tutorial" ? "Level 0" : `Level ${lab.number}`;
  return { title: `${prefix} — ${lab.title}`, description: lab.subtitle };
}

export default async function LabPage({ params }: PageProps<"/web/[slug]">) {
  const { slug } = await params;
  const lab = getLabBySlug(slug);
  if (!lab) notFound();

  const nextLab = getNextLab(lab);

  return (
    <LockGate lab={lab}>
      {isPlayable(lab) ? <LabExperience lab={lab} nextLab={nextLab} /> : <Tutorial lab={lab} nextLab={nextLab} />}
    </LockGate>
  );
}
