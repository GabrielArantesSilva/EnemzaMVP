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
import type { AreaEnem } from "./inicio.types";

// Ícone por módulo — identidade visual, mapeada pelo nome
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

// Área oficial do ENEM por matéria
export const AREA_POR_MODULO: Record<string, AreaEnem> = {
  Português: "Linguagens",
  Literatura: "Linguagens",
  Inglês: "Linguagens",
  Matemática: "Matemática",
  História: "Humanas",
  Geografia: "Humanas",
  Filosofia: "Humanas",
  Sociologia: "Humanas",
  Física: "Natureza",
  Química: "Natureza",
  Biologia: "Natureza",
};

// Relevância didática e incidência na métrica TRI do ENEM
export const INCIDENCIA_POR_MODULO: Record<string, "Essencial" | "Alta" | "Média"> = {
  Matemática: "Essencial",
  Português: "Essencial",
  Física: "Alta",
  Química: "Alta",
  Biologia: "Alta",
  História: "Alta",
  Geografia: "Alta",
  Literatura: "Média",
  Inglês: "Média",
  Filosofia: "Média",
  Sociologia: "Média",
};

// Dicas estratégicas para os estudos
export const DICAS_DIDATICAS_ENEM = [
  {
    titulo: "Estratégia TRI de Ouro",
    texto: "A TRI valoriza a consistência: acertar questões difíceis e errar fáceis penaliza sua nota. Garanta primeiro o básico e médio!",
    tag: "TRI & Pontuação",
  },
  {
    titulo: "Matemática 80/20",
    texto: "Mais de 60% da prova de Matemática foca em Geometria, Funções, Razão e Proporção, e Estatística. Priorize esses temas!",
    tag: "Conteúdo Mais Recorrente",
  },
  {
    titulo: "Fixação Imediata",
    texto: "Terminou uma videoaula? Faça logo o quiz de 3 a 5 questões para consolidar na memória de longo prazo antes de avançar.",
    tag: "Método Ativo",
  },
  {
    titulo: "Interdisciplinaridade em Natureza",
    texto: "Física, Química e Biologia frequentemente se cruzam em temas ambientais, como efeito estufa, matrizes energéticas e ciclos biogeoquímicos.",
    tag: "Ciências da Natureza",
  },
];
