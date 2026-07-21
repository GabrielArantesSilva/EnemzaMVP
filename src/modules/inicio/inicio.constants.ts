import {
  Atom,
  BookMarked,
  BookOpen,
  Brain,
  Calculator,
  FlaskConical,
  Globe,
  Landmark,
  Languages,
  Leaf,
  Users,
  type LucideIcon,
} from "lucide-react";

// Ícone por módulo — não faz parte do schema (Modulo só define corHex);
// é só identidade visual, mapeada pelo nome. Ver .harness/context.md.
export const ICONE_POR_MODULO: Record<string, LucideIcon> = {
  Português: BookOpen,
  Literatura: BookMarked,
  Inglês: Languages,
  Matemática: Calculator,
  História: Landmark,
  Geografia: Globe,
  Filosofia: Brain,
  Sociologia: Users,
  Física: Atom,
  Química: FlaskConical,
  Biologia: Leaf,
};
